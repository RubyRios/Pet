#!/bin/env node

/* Add modules */
var fs = require('fs'),
	express = require('express'),
	socketio = require('socket.io'),
	requirejs = require('requirejs'),
	exec = require('child_process').exec;

/* Set app properties */
var app = express();
app.set('view engine', 'jade');
app.use(express.static(__dirname + "/public"));

/* Landingpage */
app.get('/', function(req, res) {
	res.render('index');
});

/* Start the express server */
var server = app.listen(3000, function() {
	console.log("INFO", "express server listening on port:", 3000);
});

/* Start socket.io */
io = socketio.listen(server);
console.log("INFO", "socket.io started");

/* User initiated socket connection */
io.sockets.on('connection', function(socket) {
	/* User connected to socketio */
	console.log("INFO", "socket connection established");

	/* User asks for someones code */
	socket.on('get-petricity-code', function(user) {
		console.log("INFO", "get petricity code:", user);
	});

	/* User send petricity code */
	socket.on('send-petricity-code', function(code) {
		console.log("INFO", "received petricity code:", code);
		/* Write the program to the file */
		fs.writeFile("public/compiler/main.ino", code, function(err) {
			if (err) socket.emit('petricity-message', "upload failed");
			else console.log("INFO", "petricity code was saved");
		});
		console.log("INFO", "compiling sumorobt code");
		/* Compile the program and upload it */
		var child = exec("cd public/compiler && make all && make upload",
			function (error, stdout, stderr) {
				console.log("INFO", "stdout:", stdout);
				console.log("INFO", "stderr:", stderr);
				socket.emit('petricity-message', "upload failed");
			}
		);
	});

	/* User disconnected from socket */
	socket.on('disconnect', function() {
		console.log("INFO", "socket connection ended");
	});
});
