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
app.engine('art', require('express-art-template'));
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});
app.use(router);
var roomInfo = {}

var http = require('http').Server(app);
var io = require('socket.io')(http);
var user=''

io.on('connection',function(socket){
    var url = socket.request.headers.referer;
    var splited = url.split('/');
    var roomID = splited[splited.length - 1];// 获取房间ID

    socket.on('join', function (nickName) {
        user = nickName;

        // 将用户昵称加入房间名单中
        if (!roomInfo[roomID]) {
            roomInfo[roomID] = [];
        }
        if(roomInfo[roomID].indexOf(user)===-1){
            roomInfo[roomID].push(user);
        }


        // 加入房间
        socket.join(roomID);
        // 通知房间内人员
        io.to(roomID).emit('sys', user + '加入了房间', roomInfo[roomID]);
        console.log(user + '加入了' + roomID,roomInfo[roomID]);
    });

    socket.on('chat message', function (msg,username) {

        var room = Object.keys(socket.rooms)[0]; //当前socket的房间
        io.to(room).emit('chat message',msg,username);
    })


    //失去连接
    socket.on('leave', function () {
        socket.emit('disconnect');
    });

    socket.on('disconnect', function () {
        // 从房间名单中移除
        var index = roomInfo[roomID].indexOf(user);
        if (index !== -1) {
            roomInfo[roomID].splice(index, 1);
        }
        socket.leave(roomID);    // 退出房间
        io.to(roomID).emit('sys', user + '退出了房间', roomInfo[roomID]);
        console.log(user + '退出了' + roomID);
    });
})




http.listen(3000, function () {
    console.log('listening on *:3000');
});
