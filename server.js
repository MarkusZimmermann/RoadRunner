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

var clients = [];
var players = {
    bengler: null,
    dietrich: null
};
var activeBengler;

function registerClient(socket) {
    clients.push(socket);
    enumerateClient(socket);
    console.log('user ' + socket.id + ' ('+clients.length+') connected');

    //Reply with device id
    //socket.emit('devices',socket.id);

    //Activate bengler
    if (players.bengler == null) {
        spawnPlayer(socket,'bengler');
    }
}

function enumerateClient(socket) {
    var index = clients.indexOf(socket);
    socket.emit('index',index + 1);
}

function deregisterClient(socket) {
    //Remove socket from array
    clients.splice(clients.indexOf(socket),1);
    //Check if client has any active players
    for (role in players) {
        if (players[role] == socket) {
            movePlayer(role);
        }
    }
    //Re-enumerate
    for (index in clients) {
        enumerateClient(clients[index]);
    }
}

function spawnPlayer(socket, role) {
    players[role] = socket;
    if (socket != undefined) {
        socket.emit('spawn',role);
    }
}

function movePlayer(role) {
    var socket = players[role];
    var nextId = (clients.indexOf(socket) + 1) % clients.length;
    if (clients[nextId]) {
    spawnPlayer(clients[nextId], role);
    } else {
        players[role] = null;
    }
}

io.on('connection', function(socket){
    registerClient(socket);


    socket.on('disconnect', function(){
        deregisterClient(socket);
    });

    socket.on('leave', function(role){
        movePlayer(role);
    });
/*
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });*/
});


http.listen(3000, function(){
    console.log('listening on *:3000');
});
