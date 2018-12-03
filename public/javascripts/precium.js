
var Web3 = require("web3");
function initInsatnce(){
   // web3 = new Web3("https://ropsten.infura.io/v3/aed4570c599e4438a46a982092eee546");

    web3 = new Web3(new Web3.providers.HttpProvider("http://relaxed_lamport:8545"));
    var network_version = web3.version.network;
    console.log(network_version);

}