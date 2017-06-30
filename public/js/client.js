	  $(function () {
		var socket = io();
		$('form').submit(function(){
		  socket.emit('chat message', $('#m').val());
		  $('#m').val('');
		  return false;
		});
		
		var pseudo = prompt('Quel est votre pseudo ?');
		socket.emit('petit_nouveau', pseudo);
		
		socket.on('chat message', function(msg){
		  $('#messages').append($('<li>').text(msg));
		  
		  socket.emit('message', 'Salut serveur, ça va ?');
		});		
	  });