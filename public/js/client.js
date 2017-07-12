var x;	
var socket;
var clicLocal = 0 ;
var nimp ;

function timerStart(){	
	if(clicLocal == 1){clicLocal = 0}
	socket.emit('ready', true, clicLocal);
	
	clicLocal++;

}


	  
$(function () {
	var channel;
	socket = io();

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
		spanEntete.text("Pseudo ");
		liEntete.append(spanEntete) ;
		
		spanEntete = $('<span class="columns small-6">')
		spanEntete.text("Ready ?");
		liEntete.append(spanEntete) ;
		
		
		// On ajoute tous les utilisateurs sur le site
		for(var i=0; i < nbUsers; i++){
			
			liCreate = $('<li class="row">') ;
			$('#listUsers').append(liCreate);
			
			spanCreate = $('<span class=" columns small-6">') ;
			spanCreate.text(users[i].pseudo) ;
			$(liCreate).append(spanCreate);
			if(users[i].id == socket.id){
				var checkboxId = $('<input class="columns small-6" id="'+ socket.id +'" onclick="timerStart()" type="checkbox">');
				$(liCreate).append(checkboxId);
			}
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
	
	socket.on('ready2', function(comptClickCompteur,clicLocal){

		if(comptClickCompteur == 0 || clicLocal == 0){
			clearInterval(x);
			// Set the date we're counting down to
			var countDownDate = new Date(new Date().getTime() + 10 *10000);

			// Update the count down every 1 second
			x = setInterval(function() {

			//Get todays date and time
			var now = new Date().getTime();

			// Find the distance between now an the count down date
			var distance = countDownDate - now;

			// Time calculations for days, hours, minutes and seconds
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);

			// Display the result in the element with id="timer"
			document.getElementById("timer").innerHTML = minutes + "m " + seconds + "s ";

			// If the count down is finished, write some text 
			if (distance < 0) {
				clearInterval(x);
				document.getElementById("timer").innerHTML = "EXPIRED";
			  }
			}, 1000);
			
		}else{
			clearInterval(x);
			document.getElementById("timer").innerHTML = "EXPIRED";	
			socket.emit('notReady', false);
		}
	});

});