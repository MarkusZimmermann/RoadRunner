/**
 * Created by Markus Zimmermann on 31.08.2016.
 */

//Dependencies from NPM
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Static web server
app.use(express.static('public'));
app.use('/lib',express.static('node_modules'));

//Data objects for our game
var clients = [];

function registerClient(socket) {
    //Store client in array
    clients.push(socket);
    //Assign number to client
    enumerateClient(socket);
    //Assign empty player set
    socket.players = []

    console.log('+ ' + socket.id + ' ('+clients.length+') connected');
}

function enumerateClient(socket) {
    var index = clients.indexOf(socket);
    socket.emit('index',index + 1);
}

function deregisterClient(socket) {
    //Remove socket from array
    clients.splice(clients.indexOf(socket),1);
    console.log('- ' + socket.id + ' disconnected');

    //Check if client has any active players
    /*
    for (player in socket.players) {
        movePlayer(socket, socket.players[player]);
    }*/
    //Re-enumerate
    for (index in clients) {
        enumerateClient(clients[index]);
    }
}

function spawnPlayer(socket, role) {
    if (socket != undefined) {
        //socket.players.push(role);
        socket.emit('spawn',role);
    }
}

function movePlayer(currentSocket, role) {
    var nextId = (clients.indexOf(currentSocket) + 1) % clients.length;
    var nextSocket = clients[nextId];

    //Find player in current socket
    /*var roleIndex = currentSocket.players.indexOf('role');
    if (roleIndex >= 0) {
        currentSocket.players.splice(roleIndex,1);
    }*/
    if (nextSocket) {
        spawnPlayer(nextSocket, role);
    }
}

io.on('connection', function(socket){

    registerClient(socket);

    socket.on('disconnect', function(){
        deregisterClient(socket);
    });

    socket.on('spawn', function(role){
        spawnPlayer(socket, role);
    });

    socket.on('leave', function(role){
        movePlayer(socket, role);
    });

});


http.listen(3000, function(){
    console.log('listening on *:3000');
});
