var tape = require('wrapping-tape');
var redis = require('redis');
var redisFunctions = require('../server/redis.js');
var shot = require('shot');
var server = require('../server/server.js');
var tests = {};
var client;

tests.module1 = tape({
	setup: function(t) {
		client = redisFunctions.client;
		client.select(3, function() {
			console.log('connected to db no. 3');
		});
		t.end();
	},
	teardown: function(t) {
		t.end();
	}
});

tests.module1('test can write list to db', function(t) {
	var array = ['1', '2', '3', '4', '5'];
	var listName = 'testList';
	client.RPUSH(listName, array);
	client.LRANGE(listName, 0, -1, function(error, reply) {
		t.ok(!error, 'assert error is empty');
		t.deepEqual(reply, array, 'assert arrays match!');
		client.flushdb();
		t.end();
	});
});

tests.module1('username and password can be added to db', function(t) {
	var username = 'andrew';
	var password = 12345;
	redisFunctions.addUser(username, password, client);
	var expected = {
		'andrew': '12345'
	};
	client.HGETALL('users', function(error, reply) {
		t.ok(!error, 'assert error is empty');
		t.deepEqual(reply, expected, 'user has been added to db!');
		client.flushdb();
		t.end();
	});
});

tests.module1('server can add entries to db', function(t) {
	shot.inject(server.router, {
		method: 'POST',
		url: '/signup',
		payload: 'username=andrew&password=12345'
	}, function(response) {
		var expected = {
			'andrew': '12345'
		};
		client.HGETALL('users', function(error, reply) {
			t.ok(!error, 'assert error is empty');
			t.deepEqual(reply, expected, 'server adds user to DB!');
			client.flushdb();
			t.end();
		});
	});
});

tests.module1('Chat can be added to database', function(t) {
	
	var message = '{"username":"afa","timestamp":1456420724436,"message":"dddd"}';
	redisFunctions.addUserChat(message);
	client.ZREVRANGE('history', 0, -1, function(error, reply) {
		if (error) {
			console.log(error);
		} else {
			t.deepEqual(reply, [ '{"username":"afa","timestamp":1456420724436,"message":"dddd"}' ], 'Chat message added');
			t.end();
		}
	});
});

tests.module1('Chat history can be retrieved from database', function(t) {
	var message1 = '{"username":"Me","timestamp":1456420724436,"message":"hello"}';
	var message2 = '{"username":"You","timestamp":1456420724484,"message":"hi!"}';
	redisFunctions.addUserChat(message1);
	redisFunctions.addUserChat(message2);
	redisFunctions.getChatHistory(function(reply) {
		t.deepEqual(reply, ['{"username":"Me","timestamp":1456420724436,"message":"hello"}', 
						'{"username":"afa","timestamp":1456420724436,"message":"dddd"}', 
						'{"username":"You","timestamp":1456420724484,"message":"hi!"}' ], 'Chat message retrieved!');
		t.end();
	});
});

tests.module1('Code can be added to database', function(t) {
	var exampleCode = 'function add(x, y) { \nreturn x + y; \n}';
	redisFunctions.saveCode(exampleCode);
	client.ZREVRANGE('codeHistory', 0, -1, function(error, reply) {
		if (error) {
			console.log(error);
		} else {
			t.deepEqual(reply, [ 'function add(x, y) { \nreturn x + y; \n}' ], 'Code added!');
			t.end();
		}
	});
});

tests.module1('Code history can be retrieved from database (only most recent code)', function(t) {
	var exampleCode1 = 'function add(x, y) { \nreturn x + y; \n}';
	var exampleCode2 = 'function addAndDouble(x, y) { \nx = 2 * x; \ny = 2 * y; \nreturn x + y; \n}';
	redisFunctions.saveCode(exampleCode1);
	redisFunctions.saveCode(exampleCode2);
	redisFunctions.getCode(function(reply) {
		t.deepEqual(reply, [ 'function addAndDouble(x, y) { \nx = 2 * x; \ny = 2 * y; \nreturn x + y; \n}' ], 'Chat message retrieved!');
		t.end();
	});
});

tests.module1('final teardown', function(t) {
	client.end();
	t.end();
});
