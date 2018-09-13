var mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/users');
var Schema=mongoose.Schema
var userSchema=new Schema({
    userid:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    create_time:{
        type:Date,
        default:Date.now
    },
    avatar:{
        type:String,
        default:'https://www.slartbartfast.cn/admin/avatar/default.png'
    },
    bio:{
        type:String,
        default:''
    },
    gender:{
        type:String,
        enum:[0,1,2],
        default:0
    }
})

module.exports=mongoose.model('Users',userSchema);