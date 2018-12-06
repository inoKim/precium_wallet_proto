document.write("");
function setNotice(msg){
    $("#tv_notice").text(msg);
}
function appendHistory(msg){
    $("#ta_history").text($("#ta_history").text() +"\n"+ msg);
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
                $("#ll_balance").text(" " + data + " wei");
                appendHistory( $("#tv_addr").val() + "'s balance :" + data + "wei");
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
                from_passwd: $('#tv_from_passwd').val(),
                to_addr: $('#tv_to_addr').val(),
                amount : $('#tv_amount').val()
            },
            success:function(data){
                $("#ll_balance").text(" " + data + " wei");
                appendHistory( $("#tv_addr").val() + "'s balance :" + data + "wei");
            }
        }
    )
}

