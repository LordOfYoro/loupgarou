var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var publicDir = "/public";
var users = [];

// Ajout des css et javascript ect .. 
app.use('/static', express.static(path.join(__dirname + publicDir)));

// Répertoire
app.get('/', function(req, res){
	var myPath = path.resolve(__dirname + "/public/index.html")
	res.sendFile(myPath);
});


io.on('connection', function(socket, pseudo, channel){
	// Constructeurs pour l'utilisateur
	function Users(id, pseudo){
		this.id = id ;
		this.pseudo = pseudo;
	}
	
	// Message envoyé pour chat
	io.emit('some event', { for: 'everyone' });
	socket.on('chat message', function(msg, channelParam){
		io.emit('chat message',socket.pseudo + " : " + msg, socket.channel);
	});
  
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session
    socket.on('petit_nouveau', function(pseudo) {
		
		// stock l'utilisateur dans une variable global contenu dans le socket
        socket.pseudo = pseudo;	
		
		// Création et ajout de l'utilisateur dans le tableau
		var utilisateur = new Users(socket.id, socket.pseudo);
		users.push(utilisateur);
		io.emit('users', users);
    });  
	

	
    socket.on('channel', function(channel) {
		// variable global channel contenue dans le socket
        socket.channel = channel;
    });
	
	socket.on('disconnect', function(){
		//  compare les id et delete dans le tableau le bon utilisateur
		for(var i=0; i < users.length; i++){
			if(users[i].id == socket.id ){
				users.splice(i, 1) ;
			}
		}		
		
		io.emit('users', users);
	});
});
    

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});



