var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/signup', function(req, res){
    res.sendFile(__dirname + '/signup.html');
});
app.get('/signin', function(req, res){
    res.sendFile(__dirname + '/signin.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});
io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});
io.on('connection', function(socket){
    socket.broadcast.emit('hi');
});



http.listen(3000, function(){
    console.log('listening on *:3000');
});
