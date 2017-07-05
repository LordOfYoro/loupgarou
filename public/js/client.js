	  $(function () {
		var channel;
		var socket = io();
		$('form').submit(function(){
			if( $('#m').val() !=  ''){
				  channel = $("#channel option:selected").text() ;		// quel channel selectionn?
				  socket.emit('channel', channel);			//envoie du channel ? retenir pour envoie
				  socket.emit('chat message', $('#m').val());		// envoie du message ? envoyer
				  $('#m').val('');								// Vide le input pour r?crire
				  
			}
			
			return false;
		});
		
		var pseudo = prompt('Quel est votre pseudo ?');	//Demande du pseudo
		while (pseudo == "" || pseudo.length < 4 ||  pseudo.length > 9 ){
			pseudo = prompt('Quel est votre pseudo ? (min 4 characteres, max 9)');	
		}
		
		socket.emit('petit_nouveau', pseudo);			// Envoie pseudo ? retenir
		
		socket.on('users', function(users){
			$('#listUsers').empty('li');   	// on vide la liste des utilisateurs avant de remplir
			
			var nbUsers = users.length;
			var liCreate ;
			var spanCreate;
			var liEntete;
			var spanEntete;
			
			
			liEntete = $('<li class="row">');
			$('#listUsers').append(liEntete);
			
			spanEntete = $('<span class="columns small-6">')
			spanEntete.text("Ready ? ");
			liEntete.append(spanEntete) ;
			
			spanEntete = $('<span class="columns small-6">')
			spanEntete.text("Pseudo");
			liEntete.append(spanEntete) ;
			
			
			// On ajoute tous les utilisateurs sur le site
			for(var i=0; i < nbUsers; i++){
				
				liCreate = $('<li class="row">') ;
				$('#listUsers').append(liCreate);
				if(users[i].id == socket.id){
					var checkboxId = $('<input class="columns small-6" id="'+ socket.id +'" type="checkbox">');
					$(liCreate).prepend(checkboxId);
				}
				spanCreate = $('<span class=" columns small-6">') ;
				spanCreate.text(users[i].pseudo) ;
				$(liCreate).append(spanCreate);
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