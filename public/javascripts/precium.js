document.write("");


function initInsatnce(){

    console.log('initInstance()');
}

function setNotice(msg){
    $("#tv_notice").text(msg);
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
                $("#ll_balance").val(" " + data + " wei");
            }
        }
    )
}
function genWallet(){

}