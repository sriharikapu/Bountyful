var $QuesIcons = null, $AnsIcons = null, answers;

function sendMessageToBackground(message, callback) {
  chrome.runtime.sendMessage(message, callback);
}

function notifyBackgroundForPageLoad() {
  var url = window.location.href,
    message = { event: 'pageLoaded', url: url, pageType: 'questionPage' };
  sendMessageToBackground(message, function() {});
}

function createIcons() {
  var url = window.location.href,
<<<<<<< HEAD
    $quesTarget, $ansTarget,
    imageUrl = chrome.extension.getURL('resources/icons/eye-closed/128.png');
=======
    $target, $ansTarget
    notificationText = '',
    imageUrl = chrome.extension.getURL('resources/logo.png');
>>>>>>> b8a7a1d07095bfd8a8447d69b4acaea2e1144d64

  $QuesIcons = $('<img>').attr({ class: 'icon', id: 'QuesIcons', src: imageUrl, title: 'set bounty' })
    .click(function() {
      swal.setDefaults({
        input: 'text',
        confirmButtonText: 'Next &rarr;',
        showCancelButton: true,
        progressSteps: ['1', '2']
      })

      var steps = [
        'Bounty', //answers[0]
        'Deadline' //answers[1]
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
          triggerIPFS(answers);
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

}

// call the function on clicked trigger background.js 
function triggerIPFS(answers) {

}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.messageType == 'watchStatus') {
    updateIcons(request.watchStatus);
  } else if (request.messageType == 'notification') {
    showNotification({ type: request.type, message: request.message });
  }
});

$(document).ready(notifyBackgroundForPageLoad);
