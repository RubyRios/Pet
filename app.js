#!/bin/env node

/* Add modules */
var fs = require('fs'),
    express = require('express'),
    socketio = require('socket.io'),
    requirejs = require('requirejs'),
    serialport = require('serialport'),
    exec = require('child_process').exec;

/* Set app properties */
var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + "/public"));

/* Landingpage */
app.get('/', function(req, res) {
    res.render('index');
});

/* Start the express server */
var server = app.listen(process.env.PORT || 3000, function() {
    console.log("INFO", "express server listening on port:", process.env.PORT || 3000);
});

/* Start socket.io */
io = socketio.listen(server);
console.log("INFO", "socket.io started");

/* User initiated socket connection */
io.sockets.on("connection", function(socket) {
    /* User connected to socketio */
    console.log("INFO", "socket connection established");

    /* User asks for someones code */
    socket.on("load-petricity-code", function(user) {
        console.log("INFO", "load petricity code:", user);
    });

    /* User wants to save code */
    socket.on("save-petricity-code", function(user) {
        console.log("INFO", "save petricity code:", user);
    });

    /* User disconnected from socket */
    socket.on("disconnect", function() {
        console.log("INFO", "socket connection ended");
    });
});
