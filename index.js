var app = require('express')();
var bodyParser = require('body-parser')
var session=require('express-session')
var router = require('./router');

//配置post插件
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//session
app.use(session({
    secret: 'oh my gosh',
    resave: false,
    saveUninitialized: true
}))

app.use(router);

var http = require('http').Server(app);
var io = require('socket.io')(http);
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});
io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
});
io.on('connection', function (socket) {
    socket.broadcast.emit('hi');
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});