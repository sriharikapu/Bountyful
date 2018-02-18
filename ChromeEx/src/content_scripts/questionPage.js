var $watchIcon = null,
  $popup = $('<div><!-- The Modal --><div id="myModal" class="modal">\
    <!-- Modal content --><div class="modal-content">\
    <span class="close">&times;</span>\
    <p><input id="bountVal" placeholder="Bounty Amount"/><input id="deadlineVal" placeholder="Deadline"/>\
    <input id="Address" placeholder="Address"/>\
    Some text in modal</p></div></div></div>');

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

    // Get the <span> element that closes the modal
    // var span = $("close")[0];

  $watchIcon = $('<img>').attr({ id: 'watchIcon', src: imageUrl, title: 'set bounty' })
    .click(function() {
      $(document.body).append($popup);

      var action = $(this).attr('data-action');
      // Update the watch button state ASAP. In case watch/un-watch fails,
      // the same is handled when message is received from background script.
      updateWatchIcon(action == 'watchPage');

      showNotification({type: 'se_notice', message: notificationText});

      sendMessageToBackground({ action: action, url: url }, function(){ } );
   });


  $target = $('#question').find('div.vote').first();
  $target.append($watchIcon);

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
    imageUrl = chrome.extension.getURL('resources/icons/eye-closed/128.png');
    action = 'watchPage';
  }

  $watchIcon.attr({ src: imageUrl, 'data-action': action });
}

function showNotification(notification) {
  
  // span.click(function() {
  //      modal.css("display", "none");
  // });

  // window.onclick = function(event) {
  //   if (event.target == modal) {
  //       modal.style.display = "none";
  //   }
  // }


}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.messageType == 'watchStatus') {
    updateWatchIcon(request.watchStatus);
  } else if (request.messageType == 'notification') {
    showNotification({ type: request.type, message: request.message });
  }
});

$(document).ready(notifyBackgroundForPageLoad);
