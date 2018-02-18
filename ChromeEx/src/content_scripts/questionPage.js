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
    imageUrl = chrome.extension.getURL('resources/icons/eye-closed/128.png');


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
    imageUrl = chrome.extension.getURL('resources/icons/eye-closed/128.png');
    action = 'watchPage';
  }

  $watchIcon.attr({ src: imageUrl, 'data-action': action });
}

// const IPFS = require('ipfs-mini');
// const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
  
// var submit = {
//     payload: {
//       title: "Bounty" // string representing title
//       description: "This is our description" // include requirements
//       issuer: {
//         answers[0]
//         // persona for the issuer of the bounty
//         // put the metamask thing in here
//       },
//       funders: [
//         answers[0]
//         //array of personas of those who funded the issue
//       ],
//       categories: null// categories of tasks
//       created: date.now//timestamp
//       tokenSymbol: eth//token for which the bounty pays out
//       tokenAddress: 0x0// the address for the token which the bounty pays out
//     },
//     meta: {
//       platform: 'stackoverflow'
//       schemaVersion: '0.1'
//       schemaName: 'stackoverflowSchema'
//     }
// };

// ipfs.addJSON(submit, (err, result)=> {
//   this.state.StandardBounties.issueAndActivateBounty(web3.eth.accounts[0], 
//     answers[1], 
//     result, 
//     answers[0], 
//     0x0, 
//     true, 
//     0x0, 
//     stringValue, 
//     {from: web3.eth.accounts[0], value: answers[0]}, (cerr, succ)=> {
//     if (err){
//       console.log("cerr", err);
//       this.setState({loadingString: "An error occurred. Please refresh the page and try again."});
//     } else {
//       console.log("tx success", succ);
//     }
//   });
// });


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.messageType == 'watchStatus') {
    updateWatchIcon(request.watchStatus);
  } else if (request.messageType == 'notification') {
    showNotification({ type: request.type, message: request.message });
  }
});

$(document).ready(notifyBackgroundForPageLoad);
