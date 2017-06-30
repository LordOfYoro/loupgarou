var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var publicDir = "/public";

app.use('/static', express.static(path.join(__dirname + publicDir)));

app.get('/', function(req, res){
	
	var myPath = path.resolve(__dirname + "/public/index.html")
	res.sendFile(myPath);
});


io.on('connection', function(socket, pseudo){
	
	io.emit('some event', { for: 'everyone' });
		socket.on('chat message', function(msg){
		io.emit('chat message', socket.pseudo+ " : " + msg);
	});
  
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session
    socket.on('petit_nouveau', function(pseudo) {
        socket.pseudo = pseudo;
    });  
});
    

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});



