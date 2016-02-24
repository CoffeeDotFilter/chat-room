var tape = require('tape');
var shot = require('shot');
var server = require('../server/server.js');
var fs = require('fs');


tape('check that tests work!', function(t) {
    t.equal(1,1, 'success!');
    t.end();
});

tape('check that server responds', function(t) {
	shot.inject(server.router, {method: 'GET', url: '/'}, function(response) {
		t.equal(response.statusCode, 200, 'Response "200" received from server');
		t.end();
	});
});

tape('Check that server responds with correct index.html', function(t){
	shot.inject(server.router, {method: 'GET', url: '/'}, function(response){
		t.ok(response.payload.indexOf("<!DOCTYPE html>") > -1 , 'server says oi heres there html');
		t.end();
	});
});

tape('check that css load correctly', function(t) {
	shot.inject(server.router, {method: 'GET', url: '/style.css'}, function(shotResponse) {
		fs.readFile(__dirname + '/../' + 'style.css', function(err, res) {
			t.equal(shotResponse.payload.toString('utf8'), res.toString('utf8'), 'should load css properly');
			t.end();
		});
	});
});

tape('check that all resource files load correctly', function(t) {
	t.plan(3);
	['index.html', 'style.css', 'script.js'].forEach(function(fileName){
		shot.inject(server.router, {method: 'GET', url: '/' + fileName}, function(shotResponse) {
			fs.readFile(__dirname + '/../' + fileName, function(err, res) {
				t.equal(shotResponse.payload.toString('utf8'), res.toString('utf8'), fileName + ' loaded successfully');
			});
		});
	});
});


tape('check that unknown resource request returns 404', function(t) {
	t.plan(3);
	['unknown.html', 'unknown.css', 'unknown.js'].forEach(function(fileName){
		shot.inject(server.router, {method: 'GET', url: '/' + fileName}, function(response) {
				t.equal(response.statusCode, 404, "Server returns 404");
		});
	});
});

tape('Does server return a 404 NOT FOUND for an unknown url?', function(t){
	shot.inject(server.router, {method: 'GET', url: '/unknownURl'}, function(response){
		t.equal(response.statusCode, 404, "Server returns 404");
		t.end();
	});
});

tape.onFinish(function(){
	server.server.close();
});
