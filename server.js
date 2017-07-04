var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var publicDir = "/public";
var users = [];

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
    });  
	
	socket.on('utilisateur', function(pseudo) {
        io.emit('utilisateur', pseudo);		
    });  
	
    socket.on('channel', function(channel) {
        socket.channel = channel;
    });
	
	socket.on('disconnect', function(){
		function listerToutesLesPropriétés(o){
			  var objectToInspect;
			  var result = [];
  
			  for(objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)){  
				result = result.concat(Object.getOwnPropertyNames(objectToInspect));  
			  }
			  return result; 
			}
		

		
		
		// recuperation index dans le tableau de l'utilisateur actuel
		var usersIndex;
		var userToDelete = new Users(socket.id, socket.pseudo);
		
		
		
		for(var i=0; i < users.length -1; i++){
			if(users[i].id == socket.id ){
				console.log("On est passé");
				users.splice(i, 1) ;
			}else{
				console.log("On ne passe pas");
			}
		}
		
				
		io.emit('users', users);
	});
	
});
    

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});



