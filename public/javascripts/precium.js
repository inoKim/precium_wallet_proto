document.write("");
function setNotice(msg){
    $("#tv_notice").text(msg);
}
function appendHistory(msg){
    $("#ta_history").text($("#ta_history").text() +"\r\n"+ msg);
}
function test(){
    var url_connectnode = 'http://localhost:3000/test';
    $.ajax({
            url: url_connectnode,
            method : 'get' ,
            success:function(data){
                setNotice(data);
            }
        }
    )
}

function check_balance_ropsten(){
    var url_connectnode = 'http://localhost:3000/getbalance_ropsten';
    $.ajax({
            url: url_connectnode,
            method : 'get' ,
            data : {
                "addr" : $("#tv_addr").val()
            },
            success:function(data){
                appendHistory($("#tv_addr").val() + " : " + data + " wei left on ropsten. ");
            }
        }
    )
}

function connectNode(){
    var url_connectnode = 'http://localhost:3000/connectNode';
    $.ajax({
            url: url_connectnode,
            method : 'get' ,
            success:function(data){
                setNotice(data);
                appendHistory(data);
            }
        }
    )
}
function check_balance(){
    var url_connectnode = 'http://localhost:3000/confirmBalance';
    $.ajax({
            url: url_connectnode,
            method : 'get' ,
            data : {
                addr : $("#tv_addr").val()
            },
            success:function(data){
                $("#ll_balance").text(" " + data + " wei");
                appendHistory( $("#tv_addr").val() + "'s balance :" + data + "wei");
            }
        }
    )
}
function generateWallet(){
    var url_connectnode = 'http://localhost:3000/createAccount';
    $.ajax({
            url: url_connectnode,
            method : 'post' ,
            data : {
                passwd: $('#input_passwd').val(),
            },
            success:function(data){

                let addr = data['address'];
                let privKey = data['privateKey'];

                let _text = "\r\nadress : " + addr ;
                _text += "\r\nprivateKey : " + privKey;

                appendHistory(_text);
                
            }
        }
    )
}

function transaction_ropsten(){
    var url_connectnode = 'http://localhost:3000/transaction_ropsten';
    $.ajax({
            url: url_connectnode,
            method : 'post' ,
            data : {
                from_addr : $('#tv_from_addr').val(),
                from_privk: $('#tv_from_privk').val(),
                to_addr: $('#tv_to_addr').val(),
                amount : $('#tv_amount').val(),
                gasprice : $("#tv_gasprice").val()
            },
            success:function(data){
                appendHistory("Transaction(Ropsten) hash data : 0x"+data);
            }
        }
    )
}

function transaction(){
    var url_connectnode = 'http://localhost:3000/transaction';
    $.ajax({
            url: url_connectnode,
            method : 'post' ,
            data : {
                from_addr : $('#tv_from_addr').val(),
                from_privk: $('#tv_from_privk').val(),
                to_addr: $('#tv_to_addr').val(),
                amount : $('#tv_amount').val(),
                gasprice : $("#tv_gasprice").val()

            },
            success:function(data){
                appendHistory("Transaction hash data : 0x"+data);
            }
        }
    )
}

