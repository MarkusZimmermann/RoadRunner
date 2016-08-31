/**
 * Created by Markus Zimmermann on 31.08.2016.
 */

var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
    res.send('<h1>Hello André</h1>');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
