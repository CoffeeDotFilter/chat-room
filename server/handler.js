var fs = require('fs');
var querystring = require('querystring');
var redisFunctions = require('./redis.js');

function home(request, response){
	fs.readFile(__dirname + '/../index.html', function(err, file) {
		response.writeHead(200, {"Content-type": "text/html"});
		response.end(file);
	});
}

function resource(request, response) {
	fs.readFile(__dirname + '/../' + request.url, function(error, content) {
		if (error){
			console.log(error);
			response.writeHead(404, {"Content-type": "text/css"});
			response.end();
		} else {
			var ext = request.url.split('.')[1];
			var contentType = 'text/';
			ext = (ext === 'js') ? 'javascript' : ext;
			response.writeHead(200, {'Content-type': contentType + ext});
			response.end(content);
		}
	});
}

function signup(request, response) {
	var data = '';
	request.on('data', function(chunk) {
		data += chunk;
	});
	request.on('end', function() {
		response.writeHead(302, {'Location': '/', 'Content-type': 'text/html'});
		var userObj = querystring.parse(data);
		redisFunctions.addUser(userObj.username, userObj.password);
		response.end();
	});
}

function notFound(request, response) {
	response.writeHead(404, {'Content-type': 'text/html'});
	response.end('404 page not found');
}

module.exports = {
	home:  home,
	resource: resource,
	signup: signup,
	notFound: notFound	
};