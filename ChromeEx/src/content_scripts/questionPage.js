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
    $quesTarget, $ansTarget,
    imageUrl = chrome.extension.getURL('resources/logo.png');

  $QuesIcons = $('<img>').attr({ class: 'icon', id: 'QuesIcons', src: imageUrl, title: 'set bounty' })
    .click(function() {

      swal.setDefaults({
        progressSteps: ['1', '2', '3']
      })

      var steps = [{
        title: 'Is this your address?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, that is me!',
        cancelButtonText: 'No, that\'s not me!'

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
        if (result.value) {
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
        'Bounty ID', //answers[0]
        'Address to send to' //answers[1]
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
  $ansTarget = $('#answers').find('form.post-form').first();
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


}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.messageType == 'watchStatus') {
    updateIcons(request.watchStatus);
  } else if (request.messageType == 'notification') {
    showNotification({ type: request.type, message: request.message });
  }
});

$(document).ready(notifyBackgroundForPageLoad);
