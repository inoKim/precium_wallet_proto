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

const jNetworkType = {
    null : "invalid network",
    "AppTestToken" : "ropsten" ,
    "PreciumToken" : "main-net"
}

const networkType = ["invalid network" , "ropsten" ,"main-net"];
const ConfimationText = [null , "AppTestToken" , "PreciumToken"];

var res = null;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Precium wallet.' });
});

router.get('/connectNode', function (req , res , next){
    let result = "";
    let _res = res;
    if( typeof web3 == 'undefined'){
        result = "[fail]";
    }else{
        result = "[Connect to server successfully]";
        
        precium_contract = new web3.eth.Contract(abi , contractAddr); //version 1.0
        res = precium_contract.methods.name().call((error , echo )=> {
            
            let nType = null;
            for( key in jNetworkType){
                if( echo == key ){
                    nType = jNetworkType[key];
                }
            }
            
            console.log("network Type : " + nType);
            
            result += nType == null ? "\r\nFail to connect smart-contract" : "\r\nSuccess to connect smart-contract("+nType+")";
            _res.send(result);
        });
    }
    
});


router.get('/getbalance_ropsten' ,function(req, res , next ){
    if( web3 == null ){
        res.send("Initialize first.");
    }

    let _res = res;
    let addr = req.query.addr;
    web3.eth.getBalance(addr,(error , echo) => {
        console.log(echo);
        res.send(echo);
    });
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
    let _res = res ;
    var _addr = req.query.addr;
    res = precium_contract.methods.balanceOf(_addr).call((error , echo) => {
        console.log("Left balance : " + echo);
        _res.send(echo.toString());
    });
    
    
});

async function getNonce( _address){

    let nonce_tmp ;
    await web3.eth.getTransactionCount(_address).then((echo ) => {
        nonce_tmp = echo;
    });
    return nonce_tmp;
}
router.post('/transaction_ropsten' , function (req, res , next){
    var _from_addr = req.body.from_addr;
    var _from_privk = req.body.from_privk;
    var _to_addr = req.body.to_addr;
    var _amount = req.body.amount;

    var _res = res;

    var _nonce = getNonce(_from_addr);
     
    try{
        var Tx = require('ethereumjs-tx');
        var rawTx = {
            to : _to_addr,
            from : _from_addr ,
            value : _amount,
            nonce: '0x00',
            //nonce: _nonce,
            //gasPrice: '0x09184e72a000',
            gasPrice: '0xc350',
            gasLimit: '0xc350',
        };

        var tx = new Tx(rawTx);
        const privateKey = Buffer.from(_from_privk , 'hex');
        tx.sign(privateKey);

        var serializedTx = tx.serialize();
        var tansactionHash = web3.eth.sendSignedTransaction(
            '0x'+ serializedTx.toString('hex') ,(echo) => {
                console.log("data echo : " + echo);
                _res.send(echo);
            });
            
    }catch (e) {
        console.error(e);
    }

    //console.log( "transaction hash : "+ tansactionHash);
});


router.post('/transaction' , function (req, res , next){
    var _from_addr = req.body.from_addr;
    var _from_privk = req.body.from_privk;
    var _to_addr = req.body.to_addr;
    var _amount = req.body.amount;
    var _res = res;

    let transferData = precium_contract.methods.transfer(_to_addr , Number(_amount)).encodeABI();

    try{
        var Tx = require('ethereumjs-tx');
        var rawTx = {
            to : _to_addr,
            from : _from_addr ,
            value : _amount,
            nonce: '0x00',
            //nonce: _nonce,
            //gasPrice: '0x09184e72a000',
            data : transferData,
            gasPrice: '0xc350',
            gasLimit: '0xc350',
        };

        var tx = new Tx(rawTx);
        const privateKey = Buffer.from(_from_privk , 'hex');
        tx.sign(privateKey);

        var serializedTx = tx.serialize();

        var tansactionHash = web3.eth.sendSignedTransaction(
            '0x'+ serializedTx.toString('hex') ,(echo) => {
                console.log("data echo : " + echo);
                _res.send(echo);
            });
            
    }catch (e) {
        console.error(e);
    }
});


module.exports = router;



function oldLogic (){

        /* // connect to server and contract.
        contractInterface = web3.eth.contract(abi); // version 0.20
        precium_contract = contractInterface.at(contractAddr);
        const res = precium_contract.name(); // version 0.20.x
        
        * Have to change function what can confirm contract's version or what.*
        if( res == "AppTestToken" ){
            result += "\r\nLoading smart-contract(Ropsten) done."
        }else if( res == "PreciumToken"){
            result += "\r\nLoading smart-contract(mainNet) done."
        }else{
            result += "\r\nFail to load smart-contract.";
        }
        */


        // Balance confirmation.
        //var ret = precium_contract.balanceOf(_addr);  // return big-integer. (version 0.20.x)


}