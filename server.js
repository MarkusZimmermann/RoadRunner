/**
 * Created by Markus Zimmermann on 31.08.2016.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/jquery/jquery.js', function(req, res){
    res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.min.js');
});

//var clients = [];

io.on('connection', function(socket){
    //clients.push(socket);
    console.log('user ' + socket.id + ' connected');

    socket.on('disconnect', function(){
        //clients.rem
        console.log('user' +socket.id+ 'disconnected');
    });

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});
