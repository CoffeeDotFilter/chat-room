var server = require('./server.js');
var io = require('socket.io')(server.server);


io.on('connection', function(socket) {

	socket.on('typing', function() {
		socket.broadcast.emit('typing');
	});

	socket.on('message', function(msg) {
		io.sockets.emit('message', msg);
	});
});

module.exports = {
	io: io
};
