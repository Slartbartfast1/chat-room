var express = require('express')
var Users = require('./models/user.js')
var md5 = require('blueimp-md5')
var session = require('express-session')

var router = express.Router();
//首页

router.get('/', function (req,res) {
    res.sendFile(__dirname + '/signin.html');
});

router.get(/\d+/,function(req,res){
    var data=req.session.user
    if(!data){
        return res.sendFile(__dirname + '/signin.html');
    }
    res.render('index.art',{
        user:{
            username:data.username,
            avatar:data.avatar,
        }
    });
})

//注册
router.get('/signup', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});
router.post('/signup', function (req, res) {
    let body = req.body;
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
        //密码加密
        body.password = md5(md5(body.password))

        new Users(body).save(function (err, user) {
            if (err) {
                return res.status(500).json({success: false, message: "Server Error"})
            }

            //注册成功session
            req.session.user = user;
            ;
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
router.post('/signin',function(req,res){
    let body=req.body
    Users.findOne({
        userid:body.userid,
        password:md5(md5(body.password))
    },function(err,user){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }

        if(!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid'
            })
        }
        req.session.user=user;
        res.status(200).json({
            err_code:0,
            message:'success'
        })


    })
});

router.get('/signout',function(req,res){
    req.session.user=null;
    res.redirect('/signin')
})


module.exports = router;