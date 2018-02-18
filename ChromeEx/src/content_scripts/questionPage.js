var $watchIcon = null, $ansIcon = null,
  $popup = $('<div><!-- The Modal --><div id="myModal" class="modal">\
    <!-- Modal content --><div class="modal-content">\
    <span class="close">&times;</span>\
    <p><input id="bountVal" placeholder="Bounty Amount"/><input id="deadlineVal" placeholder="Deadline"/>\
    <input id="Address" placeholder="Address"/>\
    Some text in modal</p></div></div></div>');
$(document.body).append($popup);
$popup.attr({
  class: 'active',
});

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
    imageUrl = chrome.extension.getURL('resources/icons/eye-closed/128.png');

    // Get the <span> element that closes the modal
    // var span = $("close")[0];

  $watchIcon = $('<img>').attr({ id: 'watchIcon', src: imageUrl, title: 'set bounty' })
    .click(function() {
      $(popup).toggleClass("active");
      // $popup.attr({
      //   id: 'active'
      // });
      // $('#active').toggle();
      var action = $(this).attr('data-action');
      // Update the watch button state ASAP. In case watch/un-watch fails,
      // the same is handled when message is received from background script.
      updateWatchIcon(action == 'watchPage');

      sendMessageToBackground({ action: action, url: url }, function(){ } );
   });

    $ansIcon = $('<img>').attr({ id: 'ansIcon', src: imageUrl, title: 'set bounty' })
    .click(function() {
      $(popup).toggleClass("active");
      // $popup.attr({
      //   id: 'active'
      // });
      // $('#active').toggle();
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
  $(document.body).append($popup);

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

// function showNotification(notification) {
  
//   // span.click(function() {
//   //      modal.css("display", "none");
//   // });

//   // window.onclick = function(event) {
//   //   if (event.target == modal) {
//   //       modal.style.display = "none";
//   //   }
//   // }


// }


// // call issueandActivateBounty() -> requires that the bounty hasn't expired
//     // fulfillBounty()
//     //updateFulfillment
//     //acceptFulfillment
//     //increasePayout
//     //transferIssuer
//     //extendDeadline
//     //killBounty

//   //extendDeadline()
//   //contribute()
//   //activateBounty()

// web3 = new Web3('http://localhost:8545');

// web3.setProvider("https://rinkeby.infura.io");

// var contract = web3.eth.contract(json.interfaces.StandardBounties).at(0xf209d2b723b6417cbf04c07e733bee776105a073);
// contract.issueandActivateBounty(
//   ownAddrVal, //address_issuer = ownAddrVal, 
//   deadlineVal, //uint _deadline,
//   '', //string _data,
//   bountyVal, //uint256 _fulfillmentAmount,
//   0x0,
//   bool true,
//   address 0x0,
//   bountyVal,
// );

// //Issuing a bounty
//   // {
//   //   payload: {
//   //     title: Bounty // string representing title
//   //     description:// include requirements
//   //     issuer: {
//   //       // persona for the issuer of the bounty
//   //       // put the metamask thing in here
//   //     },
//   //     funders: [
//   //       //array of personas of those who funded the issue
//   //     ],
//   //     categories: null// categories of tasks
//   //     created: //timestamp
//   //     tokenSymbol: eth//token for which the bounty pays out
//   //     tokenAddress: 0x0// the address for the token which the bounty pays out
//   //   },
//   //   meta: {
//   //     platform: 'stackoverflow'
//   //     schemaVersion: '0.1'
//   //     schemaName: 'stackoverflowSchema'
//   //   }
//   // }


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.messageType == 'watchStatus') {
    updateWatchIcon(request.watchStatus);
  } else if (request.messageType == 'notification') {
    showNotification({ type: request.type, message: request.message });
  }
});

$(document).ready(notifyBackgroundForPageLoad);
