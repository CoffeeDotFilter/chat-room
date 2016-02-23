var http = require("http");
var port = 4000;
var fs = require('fs');
var handler = require('./handler.js');

function router(request, response){
	var url = request.url;
	if (url.length === 1) {
		handler.home(request, response);
	} else if (url.indexOf('.') > -1) {
		handler.resource(request, response);
	} else {
		handler.notFound(request, response);
	}
}

var server = http.createServer(router).listen(port);
console.log('listening on http://localhost:' + port);

module.exports = {
	server: server,
	router: router
};