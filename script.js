(function() {
	var username;
	var codeValue = '';
	var socket = io();

	// Gets message content and emits message event with object
	var send = document.getElementById('send');
	send.addEventListener('click', function(e) {
		// e.preventDefault();
		var chatMessage = document.getElementById('message');
		var msgObj = {
			username: username,
			timestamp: Date.now(),
			message: chatMessage.value
		};
		socket.emit('message', JSON.stringify(msgObj));
		chatMessage.value = '';
	});

	// Listens for message object and appends this in correct format
	socket.addEventListener('message', appendMessage);

	function appendMessage(msg) {
		var messageBox = document.getElementById('messages');
		var message = document.createElement('li');
		if (msg === undefined) return;
		msg = JSON.parse(msg);
		msg.timestamp = new Date(msg.timestamp).toUTCString();
		msg.timestamp = msg.timestamp.substr(0, msg.timestamp.length - 4);
		message.innerHTML = msg.timestamp + '\n' + msg.username + ': ' + msg.message;
		messageBox.appendChild(message);
        messageBox.scrollTop = messageBox.scrollHeight;
	}

	// Listens for changes to codeArea text box, emits event
	document.getElementById('codeArea').addEventListener('keydown', function(e) {
		// prevents default on 'tab' button and mimics tab function
		if (e.keyCode == 9 || e.which == 9) {
			e.preventDefault();
			var that = e.target;
			var s = that.selectionStart;
			that.value = that.value.substring(0, that.selectionStart) + "\t" + that.value
				.substring(that.selectionEnd);
			that.selectionEnd = s + 1;
		}

		setTimeout(function() {
			var newValue = document.getElementById('codeArea').value;
			socket.emit('codeChange', newValue);
		}, 10);
	});

	setInterval(function() {
		if (document.getElementById('codeArea').value === codeValue) {
			return;
		} else {
			codeValue = document.getElementById('codeArea').value;
			socket.emit('saveCode', codeValue);
		}
	}, 5000);

	socket.addEventListener('codeChange', function(code) {
		document.getElementById('codeArea').value = code;
	});

	// Login emits username event and saves username.
	document.getElementById('login').addEventListener('click', login);
    document.getElementById('username').addEventListener('keydown', function(e) {
        if(e.keyCode === 13) {
            login();
        }
    });

    function login() {
        var input = document.getElementById('username');
        username = input.value;
        socket.emit('username', username);
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('chat-container').classList.remove('hidden');
    }

	socket.on('history', function(data) {
		var i = data.length - 10;
		for (i; i < data.length; i++) {
			appendMessage(data[i]);
		}
	});

	socket.on('codeHistory', function(data) {
		document.getElementById('codeArea').value = data;
		codeValue = data;
	});

})();
