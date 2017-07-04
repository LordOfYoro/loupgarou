	  $(function () {
		var channel;
		var socket = io();
		$('form').submit(function(){
		  channel = $("#channel option:selected").text() ;
		  socket.emit('channel', channel);
		  socket.emit('chat message', $('#m').val());
		  $('#m').val('');
		  return false;
		});
		
		var pseudo = prompt('Quel est votre pseudo ?');
		socket.emit('petit_nouveau', pseudo);
		
		socket.on('users', function(users){
			$('#listUsers').empty('li');
			
			var nbUsers = users.length;
			var liCreate ;
			
			
			for(var i=0; i < nbUsers; i++){
				liCreate = $('<li>') ;
				liCreate.text(users[i].pseudo);
				$('#listUsers').append(liCreate);
			}
		
		});
		

		socket.on('chat message', function(msg){
			var liCreate ;
			liCreate = $('<li>') ;
			liCreate.text(msg);
			liCreate.prepend('<span class="'+ channel +'"> ['+  channel +'] </span>');
			
		  $('#listMessages').append(liCreate);
			 socket.emit('message', 'Salut serveur, ça va ?');

		});
		
		

	  });