var $QuesIcons = null, answers;

function sendMessageToBackground(message, callback) {
  chrome.runtime.sendMessage(message, callback);
}

function notifyBackgroundForPageLoad() {
  var url = window.location.href,
    message = { event: 'pageLoaded', url: url, pageType: 'questionPage' };
  sendMessageToBackground(message, function() {});
}

// document.write("<script src='background.js' type='text/javascript'></script>");

//$.getScript("background.js", function() { doIPFS(answers); });
//document.write("<script src='background.js' type='text/javascript'></script");
// call the function on clicked trigger background.js 
// function triggerIPFS(answers) {
//   console.log("hello");
//   doIPFS(answers);
// }

function createIcons() {
  var url = window.location.href,
    $quesTarget,
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


  $quesTarget = $('#question').find('div.vote').first();
  $quesTarget.append($QuesIcons);

}

function updateIcons(watchStatus) {
  var imageUrl,
    action;
  if (!$QuesIcons) {
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

}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.messageType == 'watchStatus') {
    updateIcons(request.watchStatus);
  } else if (request.messageType == 'notification') {
    showNotification({ type: request.type, message: request.message });
  }
});

$(document).ready(notifyBackgroundForPageLoad);
