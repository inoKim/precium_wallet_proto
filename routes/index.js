var express = require('express');
var router = express.Router();


var gateWay = "https://ropsten.infura.io/v3/aed4570c599e4438a46a982092eee546";
var default_passwd = "1234567890";

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(gateWay));
console.log("web3 version : " + web3.version.toString());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Precium wallet.' });
});

router.get('/test', function (req, res, next) {
   console.log('called test function.');

   var Accounts = require('web3-eth-accounts');
   var accounts = new Accounts(gateWay);

   var obj = web3.eth.accounts.create(default_passwd);
   console.log("addr : " + obj.address);
   console.log("priv key : " + obj.privateKey)
});

router.get('/confirmBalance' , function (req , res , next){
    var _response = "";
    var _addr = req.query.addr;
    web3.eth.getBalance(_addr , (err, data)=>{
        console.log(err);
        console.log("balance :" + data + "wei");
        if( typeof err != 'undefined'){
           res.send("occurred error");
        }else{
            res.send(data);
        }
    }
  )
});

router.get('/connectNode', function (req , res , next){
    var result = "";
    if( typeof web3 == 'undefined'){
        result = "[fail]";
    }else{
        result = "[Success connect to server...]";
        web3.eth.getBalance(
           // '0xe399d4d877bbedaa5f1a9e2f4fe8106c45972976'
            '0xcB89fD5A04DE73e3361996f0F0eC21b9165B1641'
            ,(err,data)=>{
            console.log(err);
            console.log("balance :" + data + "wei");
            });

    }
    res.send(result);
});
module.exports = router;
