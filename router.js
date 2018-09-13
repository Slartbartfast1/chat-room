

var express = require('express')



var router = express.Router();
//首页
router.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//注册
router.get('/signup', function(req, res){
    res.sendFile(__dirname + '/signup.html');
});

//登陆
router.get('/signin', function(req, res){
    res.sendFile(__dirname + '/signin.html');
});

module.exports = router;