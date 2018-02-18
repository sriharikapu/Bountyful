// require background.js
var $QuesIcons = null, $AnsIcons = null, answers;

function sendMessageToBackground(message, callback) {
  console.log("babyHenlo");
  chrome.runtime.sendMessage(message, callback);
}

function notifyBackgroundForPageLoad() {
  console.log("HENLO");
  var url = window.location.href,
  message = { event: 'pageLoaded', url: url, pageType: 'questionPage' };
  sendMessageToBackground(message, function() {});
  console.log("henlo after message sent?");
}

function sendipfsBackground(message, callback) {
  console.log("baby potato");
  chrome.runtime.sendMessage(message, callback);
}

function notifyipfsBackground() {
  console.log("potato");
  var url = window.location.href,
  message = {event: 'needSendTx', answers: answers};
  console.log("Script loaded but not necesarily executed."); 
  sendipfsBackground(message, function() {});
  console.log("potato after message sent?");
}

// document.write("<script src='background.js' type='text/javascript'></script>");
// function test() {
//   $.getScript("background.js", function() { 
//   console.log("Script loaded but not necesarily executed."); 
//   doIPFS(answers); 
// });
// }

//document.write("<script src='background.js' type='text/javascript'></script");
// call the function on clicked trigger background.js 
// function triggerIPFS(answers) {
//   console.log("hello");
//   doIPFS(answers);
// }

function createIcons() {
  var url = window.location.href,
    $quesTarget, $ansTarget,
    imageUrl = chrome.extension.getURL('resources/logo.png');

  $QuesIcons = $('<img>').attr({ class: 'icon', id: 'QuesIcons', src: imageUrl, title: 'set bounty' })
    .click(function() {

      swal.setDefaults({
        progressSteps: ['1', '2', '3']
      })

      var steps = [{
        title: 'Is this your address you sure?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, that is me!'
      },
        {
          input: 'text',
          title: 'Bounty',
          confirmButtonText: 'Next &rarr;',
          showCancelButton: true,
        }, //answers[0]
        {
          input: 'text',
          title: 'Deadline',
          confirmButtonText: 'Next &rarr;',
          showCancelButton: true,
        }
         //answers[1]
      ]

      swal.queue(steps).then((result) => {
        swal.resetDefaults()

        if (result.value) {
          answers = result.value;

          swal({
            title: 'All done!',
            html:
              'Your answers: <pre>' +
                JSON.stringify(result.value) +
              '</pre>',
            confirmButtonText: 'Lovely!'
          })
          //triggerIPFS(answers);
        }
      }).then((result) => {
        if (result != undefined && result.value) {
          swal(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
      var action = $(this).attr('data-action');
      // Update the watch button state ASAP. In case watch/un-watch fails,
      // the same is handled when message is received from background script.
      updateIcons(action == 'watchPage');

      sendMessageToBackground({ action: action, url: url }, function(){ } );
   });


  $AnsIcons = $('<img>').attr({ class: 'icon', id: 'AnsIcons', src: imageUrl, title: 'get bounty' })
    .click(function() {
      swal.setDefaults({
        input: 'text',
        confirmButtonText: 'Next &rarr;',
        showCancelButton: true,
        progressSteps: ['1', '2']
      })

      var steps = [
        'Ans1', //answers[0]
        'Ans2' //answers[1]
      ]

      swal.queue(steps).then((result) => {
        swal.resetDefaults()

        if (result.value) {
          answers = result.value;
          swal({
            title: 'All done!',
            html:
              'Your answers: <pre>' +
                JSON.stringify(result.value) +

              '</pre>',
            confirmButtonText: 'Lovely!'
          })
        }
      })      
      var action = $(this).attr('data-action');
      // Update the watch button state ASAP. In case watch/un-watch fails,
      // the same is handled when message is received from background script.
      updateIcons(action == 'watchPage');

      sendMessageToBackground({ action: action, url: url }, function(){ } );
      //sendipfsBackground({action: action}, function() { });

   });

  $quesTarget = $('#question').find('div.vote').first();
  $quesTarget.append($QuesIcons);
  $ansTarget = $('#answers').find('div.post-editor').first();
  $ansTarget.append($AnsIcons);

}

function updateIcons(watchStatus) {
  var imageUrl,
    action;
  if (!$QuesIcons && !$AnsIcons) {
    createIcons();
  }

  if (watchStatus) {
    imageUrl = chrome.extension.getURL('resources/icons/eye-open/128.png');
    action = 'unwatchPage';
  } else {
    imageUrl = chrome.extension.getURL('resources/logo.png');
    action = 'watchPage';
  }
  $QuesIcons.attr({ src: imageUrl, 'data-action': action });
  $AnsIcons.attr({ src: imageUrl, 'data-action': action });
  sendipfsBackground({action: action}, function() { });
}




chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.messageType == 'watchStatus') {
    updateIcons(request.watchStatus);
  } else if (request.messageType == 'notification') {
    showNotification({ type: request.type, message: request.message });
  }
});

$(document).ready(notifyBackgroundForPageLoad);
$(document).ready(notifyipfsBackground);
