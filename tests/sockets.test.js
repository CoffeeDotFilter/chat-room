// 1. Can a user connect?

var tape = require('tape');
var server = require('../server/server.js').server;
var io = require('socket.io-client');

var options = {
	transports: ['websocket'],
	'force new connection': true
};
var hostURL = 'http://localhost:4000';

tape('socket should emit a connect event', function(t) {
	var client = io.connect('http://localhost:4000', options);
	client.on('connect', function() {
		t.ok(client.connected, 'client has connected');
		client.disconnect();
		t.end();
	});
});

tape('socket should emit a disconnect event', function(t) {
	var client = io.connect('http://localhost:4000', options);
	client.on('connect', function() {
		client.disconnect();
		t.notOk(client.connected, 'client has disconnected');
		t.end();
	});
});

tape('Should be able to broadcast messages', function(t) {
	var client1, client2, client3;
	var message = 'Hello World';
	var messages = 0;
	var socketURL = 'http://localhost:4000';

	var checkMessage = function(client) {
		client.on('message', function(msg) {
			t.equals(msg, message, 'message has been received by client ' + (
				messages + 1));
			client.disconnect();
			messages++;
			if (messages === 3) {
				t.end();
			}
		});
	};

	client1 = io.connect(socketURL, options);
	checkMessage(client1);

	client1.on('connect', function(data) {
		client2 = io.connect(socketURL, options);
		checkMessage(client2);

		client2.on('connect', function(data) {
			client3 = io.connect(socketURL, options);
			checkMessage(client3);

			client3.on('connect', function(data) {
				console.log('about to send message!');
				client2.emit('message', message);
			});
		});
	});
});

tape('Should be able to detect when user is typing', function(t) {
	var client1, client2;
	client1 = io.connect(hostURL, options);
	// t.plan(2);

	var checkTyping = function(client) {
		client.on('typing', function() {
			t.ok(true, 'user is typing');
			client.disconnect();
		});
	};

	var checkNotTyping = function(client) {
		client.on('typing', function() {
			t.fail('user should not see their own typing message');
		});
		setTimeout(function() {
			client1.disconnect();
			t.end();
		}, 100);
	};

	client1.on('connect', function() {
		client2 = io.connect(hostURL, options);
		client2.on('connect', function() {
			checkTyping(client2);
			checkNotTyping(client1);
			client1.emit('typing');

		});
	});
});
