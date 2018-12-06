var express = require('express');
var router = express.Router();



// import web3 libraries.
var gateWay = "https://ropsten.infura.io/v3/aed4570c599e4438a46a982092eee546"; // mining node gateway.
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(gateWay));
console.log("web3 version : " + web3.version.api); // using web3@0.20.6(web3@1.0.x (beta))


var default_passwd = "1234567890"; // Default password to be used for the wallet to be created

var abi = require('./abi.json'); // precium_contract abi
var bin = require('./bin.bin'); // precium_contract binaries.
var contractAddr = "0x9387A03BbB50e0AF52DFd56Aa977f8Ab3E346135"; //precium_contract addr.(ropsten)

var contractInterface ;
var precium_contract ;



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Precium wallet.' });
});

router.get('/connectNode', function (req , res , next){

    var result = "";
    if( typeof web3 == 'undefined'){
        result = "[fail]";
    }else{
        result = "[Connect to server successfully]";
        //precium_contract = new web3.eth.Contract(abi , contractAddr); //version 1.0

        ///*
        contractInterface = web3.eth.contract(abi); // version 0.20
        precium_contract = contractInterface.at(contractAddr);
        const res = precium_contract.name(); // version 0.20.x
        //*/
        //////  * Have to change function what can confirm contract's version or what.*

        //var ret = precium_contract.methods.name(); // version 1.0
        if( res == "AppTestToken" ){
            result += "\r\nLoading smart-contract(Ropsten) done."
        }else if( res == "PreciumToken"){
            result += "\r\nLoading smart-contract(mainNet) done."
        }else{
            result += "\r\nFail to load smart-contract.";
        }
        //////
    }
    res.send(result);
});


router.get('/test', function (req, res, next) {
    console.log('called test function.');

    var obj = web3.eth.accounts.create(default_passwd);
    console.log("addr : " + obj.address);
    console.log("priv key : " + obj.privateKey);

});

router.post('/createAccount', function (req, res, next) {

    var _passwd= req.body.passwd;

    var obj = web3.eth.accounts.create(default_passwd);
    console.log("addr : " + obj.address);
    console.log("priv key : " + obj.privateKey);
    res.json({
        "address" : obj.address,
        "privateKey" : obj.privateKey
    });
});


router.get('/confirmBalance' , function (req , res , next){
    var _addr = req.query.addr;
    var ret = precium_contract.balanceOf(_addr);  // return big-integer.
    res.send(ret.toString());
});

router.post('/transaction' , function (req, res , next){
    var _from_addr = req.body.from_addr;
    var _from_passwd = req.body.from_passwd;
    var _to_addr = req.body.to_addr;
    var _amount = req.body.amount;

    

    /*var bRet = precium_contract.transferFrom(
        _from_addr,
        _to_addr,
        _amount,
        );

    */

    try{

        var Tx = require('ethereumjs-tx');
        var rawTx = {
            to : _to_addr,
            from : _from_addr ,
            value : _amount
        };

        var tx = new Tx(rawTx);
        const privateKey = Buffer.from(_from_passwd , 'hex');
        tx.sign(privateKey);

        var serializedTx = tx.serialize();
        var tansactionHash = web3.sendRawTransaction('0x'+ serializedTx.toString('hex'));
    }catch (e) {
        console.error(e);
    }

    console.log(txHash);
});
module.exports = router;

