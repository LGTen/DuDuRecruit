var express = require('express');
var router = express.Router();
const md5=require('blueimp-md5');

const UserModel=require('../db/models').UserModel;
const ChatModel=require('../db/models').ChatModel;
const filter={password:0};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/update",function(req,res){
  const userid=req.cookies.userid;
  if(!userid){
    return res.send({code:1,msg:"请先登录"})
  }
  UserModel.findByIdAndUpdate({_id:userid},req.body,function(err,user){
    const {_id,username,type}=user;
    const data=Object.assign(req.body,{_id,username,type});
    res.send({code:0,data})
  })
})

router.post('/register',function(req,res,next){
  const {username,password,type}=req.body;
  console.log(req.body)
  UserModel.findOne({username},function(err,user){
    if(user){
      res.send({code:1,msg:"此用户已存在"})
    }
    else{
      new UserModel({username,password:md5(password),type}).save(function(err,user){
        res.cookie("userid",user._id,{maxAge:1000*60*60*24});
        res.send({code:0,data:{_id:user._id,username,type}})
      })
    }
  })
})

router.post("/login",function(req,res){
  const {username,password}=req.body;
  UserModel.findOne({username,password:md5(password)},filter,function(err,user){
    if(!user){
      res.send({code:1,msg:"用户名或密码错误"})
    }
    else{
      res.cookie('userid',user._id,{maxAge:1000*60*60*24*7});
      res.send({code:0,data:user})
    }
  })
})

router.get("/user",function(req,res){
  const userid=req.cookies.userid;
  if(!userid){
    return res.send({code:1,msg:"请先登录"});
  }
  UserModel.findOne({_id:userid},filter,function(error,user){
    res.send({code:0,data:user});
  })
})

//根据用户类型获取列表

router.get("/userlist",function(req,res){
  const {type}=req.query;
  UserModel.find({type},filter,function(err,users){
    res.send({code:0,data:users})
  })
})

/*
获取当前用户所有相关聊天信息列表
 */
router.get('/msglist', function (req, res) {
  const userid = req.cookies.userid;
  // 查询得到所有user文档数组
  UserModel.find(function (err, userDocs) {
    // 用对象存储所有user信息: key为user的_id, val为name和header组成的user对象
    const users = userDocs.reduce((users, user) => {
      users[user._id] = {username: user.username, avatar: user.avatar}
      return users
    } , {})
    //聊天信息
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) {
      // 返回包含所有用户和当前用户相关的所有聊天消息的数据
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})
/*
修改指定消息为已读
 */
router.post('/readmsg', function (req, res) {
  // 得到请求中的from和to
  const from = req.body.from;
  const to = req.cookies.userid;
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
    console.log('/readmsg', doc)
    res.send({code: 0, data: doc.nModified}) // 更新的数量
  })
})
module.exports = router;
