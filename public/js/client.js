	  $(function () {
		var socket = io();
		$('form').submit(function(){
		  var channel = $("#channel option:selected").text() ;
		  socket.emit('channel', channel);
		  socket.emit('chat message', $('#m').val());
		  $('#m').val('');
		  return false;
		});
		
		var pseudo = prompt('Quel est votre pseudo ?');
		socket.emit('petit_nouveau', pseudo);
		

		
		socket.on('chat message', function(msg){
		  $('#messages').append($('<li>').text(msg));
		});
	  });