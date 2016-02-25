var socket = io();

// Gets message content and emits message event with object
var send = document.getElementById('send');
send.addEventListener('click', function(e) {
    // e.preventDefault();
    var chatMessage = document.getElementById('message');
    var msgObj = {
        timestamp: Date.now(),
        message: chatMessage.value
    };
    socket.emit('message', JSON.stringify(msgObj));
    chatMessage.value = '';
});

// Listens for message object and appends this in correct format
socket.addEventListener('message', function(msg) {
    console.log('message event');
    var messageBox = document.getElementById('messages');
    var message = document.createElement('li');
    var msgObj = JSON.parse(msg);
    message.innerHTML = msgObj.timestamp + '>>>' + msgObj.message;
    messageBox.appendChild(message);
});

// Listens for changes to codeArea text box, emits event
document.getElementById('codeArea').addEventListener('keydown', function(e){
    // prevents default on 'tab' button and mimics tab function
    if(e.keyCode==9 || e.which==9){
        e.preventDefault();
        var that = e.target;
        var s = that.selectionStart;
        that.value = that.value.substring(0,that.selectionStart) + "\t" + that.value.substring(that.selectionEnd);
        that.selectionEnd = s+1; 
    }

    setTimeout(function(){
        var newValue = document.getElementById('codeArea').value;
        socket.emit('codeChange', newValue);
    }, 10);
});

socket.addEventListener('codeChange', function(code) {
    document.getElementById('codeArea').value = code;
});