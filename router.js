var express = require('express')
var Users = require('./models/user.js')
var md5=require('blueimp-md5')

var router = express.Router();
//首页
router.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

//注册
router.get('/signup', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});
router.post('/signup', function (req, res) {
    var body = req.body;
    Users.findOne({
        $or: [{
            userid: body.userid,
        }, {
            username: body.username
        }]
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: "Server Error"
            });

        }
        if (data) {
            return res.status(200).json({
                err_code: 1,
                message: "email or username exits"
            })
        }
        body.password=md5(md5(body.password))
        new Users(body).save(function (err, user) {
            if (err) {
                return res.status(500).json({success: false, message: "服务器错误"})
            }
            res.status(200).json({
                err_code: 0,
                message: "success"
            });

        })

    })
})


//登陆
router.get('/signin', function (req, res) {
    res.sendFile(__dirname + '/signin.html');
});

// router.post('/signin',function(){
//
// });

module.exports = router;