var socket = io();

// Gets message content and emits message event with object
var send = document.getElementById('send');
send.addEventListener('click', function(e) {
    console.log('button clicked');
    e.preventDefault(); //???
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