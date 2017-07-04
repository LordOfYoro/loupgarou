	  $(function () {
		var channel;
		var socket = io();
		$('form').submit(function(){
		  channel = $("#channel option:selected").text() ;		// quel channel selectionn?
		  socket.emit('channel', channel);			//envoie du channel ? retenir pour envoie
		  socket.emit('chat message', $('#m').val());		// envoie du message ? envoyer
		  $('#m').val('');								// Vide le input pour r?crire
		  return false;
		});
		
		var pseudo = prompt('Quel est votre pseudo ?');	//Demande du pseudo
		socket.emit('petit_nouveau', pseudo);			// Envoie pseudo ? retenir
		
		socket.on('users', function(users){
			$('#listUsers').empty('li');   	// on vide la liste des utilisateurs avant de remplir
			
			var nbUsers = users.length;
			var liCreate ;
	
	// On ajoute tous les utilisateurs sur le site
			for(var i=0; i < nbUsers; i++){
				liCreate = $('<li>') ;
				liCreate.text(users[i].pseudo);
				$('#listUsers').append(liCreate);
			}
		});
		
		// Ajout du message sur le site
		socket.on('chat message', function(msg, channelParam){
			var liCreate ;
			liCreate = $('<li>') ;
			liCreate.text(msg);
			liCreate.prepend('<span class="'+ channelParam +'"> ['+  channelParam +'] </span>');
			
		  $('#listMessages').append(liCreate);
		  $('#messages').scrollTop($('#listMessages')[0].scrollHeight);
		});
		
		
	  });