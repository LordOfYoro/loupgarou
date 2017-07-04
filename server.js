var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var publicDir = "/public";
var users = [];
var usersIndex;

app.use('/static', express.static(path.join(__dirname + publicDir)));

app.get('/', function(req, res){
	
	var myPath = path.resolve(__dirname + "/public/index.html")
	res.sendFile(myPath);
});


io.on('connection', function(socket, pseudo, channel){
	
	function Users(id, pseudo){
		this.id = id ;
		this.pseudo = pseudo;
	}
	
	
	io.emit('some event', { for: 'everyone' });
	socket.on('chat message', function(msg){
				
		io.emit('chat message',socket.pseudo + " : " + msg);
	});
  
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session
    socket.on('petit_nouveau', function(pseudo) {
        socket.pseudo = pseudo;	
		
		
		var utilisateur = new Users(socket.id, socket.pseudo);
		users.push(utilisateur);
		io.emit('users', users);
		
		// recuperation index dans le tableau de l'utilisateur actuel
		
		usersIndex = users.indexOf(users[users.length -1]);		
		
		

    });  
	
	socket.on('utilisateur', function(pseudo) {
        io.emit('utilisateur', pseudo);		
    });  
	
    socket.on('channel', function(channel) {
        socket.channel = channel;
    });
	
	socket.on('disconnect', function(){
		
		// delete du bon utilisateur
		users.splice(usersIndex, 1);
				
		io.emit('users', users);
	});
	
});
    

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});



