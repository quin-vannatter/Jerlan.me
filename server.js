

'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var shortid = require('shortid');

// Set port to listen on.
var port = 3700;

// Server client.html for GET requests.
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/client.html');
});

// Setup static directory (js/css/etc).
app.use(express.static(__dirname + '/public'));

// Set server to listen on specified port.
http.listen(port, function () {
    console.log('Listening on port ' + port);
});

// Set access control allow origin to all so images can be manipulated.
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

// Include the script for the game.
var gameJS = new require('./public/game.js');

/**
 * Anonymous function that runs the server script.
 */
(function() {

})();