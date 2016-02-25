var http = require("http");
var port = 4000;
var fs = require('fs');
var handler = require('./handler.js');
var redisFunctions = require('./redis.js');

function router(request, response) {
	var url = request.url;
	if (url.length === 1) {
		handler.home(request, response);
	} else if (url.indexOf('.') > -1) {
		handler.resource(request, response);
	} else if (url.indexOf('signup') > -1) {
		handler.signup(request, response);
	} else {
		handler.notFound(request, response);
	}
}

var server = http.createServer(router).listen(port);
console.log('listening on http://localhost:' + port);

var io = require('socket.io')(server);

io.on('connection', function(socket) {
	socket.on('message', function(msg){
    	io.emit('message', msg);
  	});
  	socket.on('codeChange', function(code) {
  		socket.broadcast.emit('codeChange', code);
  	});
});

module.exports = {
	server: server,
	router: router
};
