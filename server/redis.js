if(process.env.REDISTOGO_URL) {
	var rtg = require('url').parse(process.env.REDISTOGO_URL);
	var client = require('redis').createClient(rtg.port, rtg.hostname);
} else {
	var redis = require('redis');
	var client = redis.createClient();
}

function addUser(username, password) {
	client.HSET('users', username, password, function(error, reply) {
		if (error) {
			console.log('error!', error);
		} else {
			console.log('user added');
		}
	});
}

function getChatHistory(callback) {
	client.ZRANGE('history', 0, -1, function(error, reply) {
		if (error) {
			console.log(error);
		} else {
			callback(reply);
		}
	});
}

function addUserChat(message) {
	var messageObj = JSON.parse(message); 
	client.ZADD('history', messageObj.timestamp, message, function(error, reply) {
		if (error) {
			console.log(error);
		} else {
			console.log('Add user message success: ' + reply);
		}
	});
}

function saveCode(code) {
	var time = Date.now();
	client.ZADD('codeHistory', time, code, function(error, reply) {
		if(error) {
			console.log(error);
		} else {
			console.log('Save code success: ' + reply);
		}
	});
}

function getCode(callback) {
	client.ZREVRANGE('codeHistory', 0, 0, function(error, reply) {
		if (error) {
			console.log(error);
		} else {
			callback(reply);
		}
	});
}

module.exports = {
	addUser: addUser,
	getChatHistory: getChatHistory,
	addUserChat: addUserChat,
	getCode: getCode,
	saveCode: saveCode,
	client: client
};
