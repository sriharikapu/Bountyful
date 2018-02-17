var $watchIcon = null,
  $notificationDiv = $('<div></div>').attr({id: 'se_notifier', title: 'Click to confirm'})
  $modal = $('<!-- Trigger/Open The Modal --> \
    <button id="myBtn">Open Modal</button> \
    <!-- The Modal --> \ 
    <div id="myModal" class="modal"> \
    <!-- Modal content --> \
    <div class="modal-content"> \
    <span class="close">&times;</span> \
    <p>Some text in the Modal..</p> \
  </div> \
</div>');

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
    $target,
    notificationText = '',
    imageUrl = chrome.extension.getURL('resources/icons/eye-closed/128.png');

  $watchIcon = $('<img>').attr({ id: 'watchIcon', src: imageUrl, title: 'watch question' })
    .click(function() {
      var action = $(this).attr('data-action');

      // Update the watch button state ASAP. In case watch/un-watch fails,
      // the same is handled when message is received from background script.
      updateWatchIcon(action == 'watchPage');

      if (action == 'watchPage') {
        notificationText = 'CLICK HERE to confirm';
      } else {
        notificationText = 'Will do nothing eventually';
      }

      showNotification({type: 'se_notice', message: notificationText});

      sendMessageToBackground({ action: action, url: url }, function(){ } );
   });

  
  // $notificationDiv.click(function() {
  //   $(this).hide();
  //   //put function here from .sol
  // });

  $target = $('#question').find('div.vote').first();
  $target.append($watchIcon);
  $(document.body).append($notificationDiv);
}

function updateWatchIcon(watchStatus) {
  var imageUrl,
    action;

  if (!$watchIcon) {
    createWatchIcon();
  } else {
    // setTimeout(function() {
    //   $notificationDiv.fadeOut(5000);
    // }, 3000);
  }

  if (watchStatus) {
    imageUrl = chrome.extension.getURL('resources/icons/eye-open/128.png');
    action = 'unwatchPage';
  } else {
    imageUrl = chrome.extension.getURL('resources/icons/eye-closed/128.png');
    action = 'watchPage';
  }

  $watchIcon.attr({ src: imageUrl, 'data-action': action });
}

function showNotification(notification) {
  var $bountyVal= $('<input/>').attr({ type: 'form', name:'bountval', placeholder:'Bounty'});
  var $deadlineVal= $('<input/>').attr({ type: 'form', name:'deadlval', placeholder:'Deadline (in blocks)'});
  var $ownAddrVal= $('<input/>').attr({ type: 'form', name:'ownaddrval', placeholder:'Address'});

  var $button= $('<input/>').attr({ type: 'button', name:'confirm', value:'Confirm'});


  $notificationDiv.text(notification.message)
    .removeClass('se_notice se_error se_success').addClass(notification.type)
    .fadeIn(1000);
  $notificationDiv.append($bountyVal);
  $notificationDiv.append($deadlineVal);
  $notificationDiv.append($ownAddrVal);
  $notificationDiv.append($button);

  $button.click(function() {
    $notificationDiv.remove();
    //put function here from .sol
  });


}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.messageType == 'watchStatus') {
    updateWatchIcon(request.watchStatus);
  } else if (request.messageType == 'notification') {
    showNotification({ type: request.type, message: request.message });
  }
});

$(document).ready(notifyBackgroundForPageLoad);
