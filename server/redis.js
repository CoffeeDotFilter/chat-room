var redis = require('redis');
var client = redis.createClient();



function addUser(username, password) {
	client.HSET('users', username, password, function(error, reply) {
		if (error) {
			console.log('error!', error);
		} else {
			console.log('user added');
		}
	});
}

module.exports = {
	addUser: addUser,
	client: client
};
