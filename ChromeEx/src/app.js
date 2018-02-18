import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

import artifacts from '../contracts.json';

var providerLink = "https://rinkeby.infura.io";
var requiredNetwork = 4;
var standardBountiesAddress = artifacts.rinkeby.standardBountiesAddress.v1;
var userCommentsAddress = artifacts.rinkeby.userCommentsAddress;
var networkName = "Rinkeby Network";

web3.setProvider(new Web3.providers.HttpProvider(providerLink));
console.log("artifacts.rinkeby.standardBountiesAddress.v1", artifacts.rinkeby.standardBountiesAddress.v1);

var contract = web3.eth.contract(artifacts.interfaces.StandardBounties).at(standardBountiesAddress);

var accounts;
var account;

window.App = {
	start: function() {
	    var self = this;
	    contract.setProvider(web3.currentProvider);
	    console.log("Provider set.");

	    web3.eth.getAccounts(function(err, accs) {
	      if (err != null) {
	        alert("There was an error fetching your accounts.");
	        return;
	      }

	      if (accs.length == 0) {
	        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
	        return;
	      }

	      accounts = accs;
	      account = accounts[0];
	    });
	},

	issueAndActivate: function(issuer, deadline, amt, val) {
		var self = this;
		var message = contract.issueAndActivateBounty(issuer, 
													  deadline,
													  "",
													  amt,
													  0x0,
													  false,
													  0x0,
													  val);
		console.log(message);
	},

	fulfill: function() {
		
	}
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});