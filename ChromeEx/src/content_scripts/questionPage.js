var $watchIcon = null,
  $notificationDiv = $('<div></div>').attr({id: 'se_notifier', title: 'Click to confirm'}),
  $popup = $('<span><!-- The Modal --><div id="myModal" class="modal"><!-- Modal content --><div class="modal-content"><span class="close">&times;</span><p>Some text in the Modal..</p></div></div></span>');

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
    var span = $("close")[0];

  $watchIcon = $('<img>').attr({ id: 'watchIcon', src: imageUrl, title: 'set bounty' })
    .click(function() {
      // $(document.body).append($modal);
      $tester = $('<div></div>').attr({id: 'test'}),
      $(document.body).addClass("hello");
      console.log("dafjfa");
      //$(popup).css("display", "block");

      //modal.style.display = "block";
      console.log("jk;j");

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

  // span.click(function() {
  //      modal.css("display", "none");

  // });

  // window.onclick = function(event) {
  //   if (event.target == modal) {
  //       modal.style.display = "none";
  //   }
  // }

}

const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'});

var submit = {
    payload: {
      title: "Bounty" // string representing title
      description: "This is our description" // include requirements
      issuer: {
        // persona for the issuer of the bounty
        // put the metamask thing in here
      },
      funders: [
        //array of personas of those who funded the issue
      ],
      categories: null// categories of tasks
      created: //timestamp
      tokenSymbol: eth//token for which the bounty pays out
      tokenAddress: 0x0// the address for the token which the bounty pays out
    },
    meta: {
      platform: 'stackoverflow'
      schemaVersion: '0.1'
      schemaName: 'stackoverflowSchema'
    }
};

ipfs.addJSON(submit, (err, result)=> {
  this.state.StandardBounties.issueAndActivateBounty(this.state.accounts[0], date, result, stringAmount, 0x0, false, 0x0, stringValue, {from: this.state.accounts[0], value: stringValue}, (cerr, succ)=> {
    if (err){
      console.log("cerr", err);
      this.setState({loadingString: "An error occurred. Please refresh the page and try again."});
    } else {
      console.log("tx success", succ);
    }
  });
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.messageType == 'watchStatus') {
    updateWatchIcon(request.watchStatus);
  } else if (request.messageType == 'notification') {
    showNotification({ type: request.type, message: request.message });
  }
});

$(document).ready(notifyBackgroundForPageLoad);
