var $watchIcon = null, $ansIcon = null, answers;

function sendMessageToBackground(message, callback) {
  chrome.runtime.sendMessage(message, callback);
}

function notifyBackgroundForPageLoad() {
  var url = window.location.href,
    message = { event: 'pageLoaded', url: url, pageType: 'questionPage' };
  sendMessageToBackground(message, function() {});
}

function createWatchIcon() {
  var url = window.location.href,
    $target, $ansTarget
    notificationText = '',
    imageUrl = chrome.extension.getURL('resources/logo.png');


  $watchIcon = $('<img>').attr({ id: 'watchIcon', src: imageUrl, title: 'set bounty' })
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
      updateWatchIcon(action == 'watchPage');

      sendMessageToBackground({ action: action, url: url }, function(){ } );
   });

    $ansIcon = $('<img>').attr({ id: 'ansIcon', src: imageUrl, title: 'set bounty' })
    .click(function() {

      var action = $(this).attr('data-action');
      // Update the watch button state ASAP. In case watch/un-watch fails,
      // the same is handled when message is received from background script.
      updateWatchIcon(action == 'watchPage');

      sendMessageToBackground({ action: action, url: url }, function(){ } );
   });

  $target = $('#question').find('div.vote').first();
  $target.append($watchIcon);
  $ansTarget = $('#answers').find('div.answers-header').first();
  $ansTarget.append($ansIcon);
  // $(document.body).append($popup);

  //$target = $('#answers').find('div.vote').second();
  //$target.append($watchIcon);
  $(document.body).append($notificationDiv);
  //$(document.body).append($popup);
}

function updateWatchIcon(watchStatus) {
  var imageUrl,
    action;

  if (!$watchIcon) {
    createWatchIcon();
  } else {
  }

  if (watchStatus) {
    imageUrl = chrome.extension.getURL('resources/icons/eye-open/128.png');
    action = 'unwatchPage';
  } else {
    imageUrl = chrome.extension.getURL('resources/logo.png');
    action = 'watchPage';
  }

  $watchIcon.attr({ src: imageUrl, 'data-action': action });
}

// call the function on clicked trigger background.js 
function triggerIPFS(answers) {

}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.messageType == 'watchStatus') {
    updateWatchIcon(request.watchStatus);
  } else if (request.messageType == 'notification') {
    showNotification({ type: request.type, message: request.message });
  }
});

$(document).ready(notifyBackgroundForPageLoad);
