var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');


app.use('/static', express.static(path.resolve(__dirname + "/..")));

app.get('/', function(req, res){

	
  res.sendFile(path.resolve(__dirname + "/../index.html"));
  
  
});


io.on('connection', function(socket){
io.emit('some event', { for: 'everyone' });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
    

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});