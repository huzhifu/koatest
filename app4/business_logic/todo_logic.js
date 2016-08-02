/**
 * Created by 胡志甫 on 2016/6/12.
 */
var db=require('../dao/db.js');
var crypto=require('crypto');
function withError(err){
    if(err){
        console.error(err);
        return next(error);
    }
}

//上传头像
var uploadAvatar=function(req,res,next){
    res.render('upload_avatar.ejs',{loginState:'logined',userInfo:req.session.user});
}
exports.uploadAvatar=uploadAvatar;
//处理上传头像的逻辑
var uploadAvatarPost=function(req,res,next){
  var userID=req.session.user._id;
    var avatarFileName=req.session.user.userName;
    db.updateAvatar(userID,avatarFileName,function(err,result){
        withError(err);
        req.session.user=result;
        res.redirect('/');
    });
    /*混乱代码db.findItemByUserId(userID,function(err,result){
        withError(err);
        if(!result){
            var err=new Error('一些东西出现错误');
            console.error(err);
            return next(err);
        }else{
            result.avatar='uploaded';
            result.avatarFileName=result.userName;
            res.redirect('/');
        }
    });*/
}
exports.uploadAvatarPost=uploadAvatarPost;
//更新操作
var update=function(req,res,next){
    var id=req.params.id;
    db.selectById(id,function(err,result){
        withError(err);
        console.log(result);
        res.render('edit.ejs',{loginState:'logined',item:result[0],userInfo:req.session.user});
    });
};
exports.update=update;
//删除操作
var deleteAction=function(req,res,next){
    var id=req.params.id;
    db.deleteOne(id,function(err,result){
        withError(err);
        console.log(result);
        res.redirect('/');
    });
};
exports.delete=deleteAction;
//完成操作
var finish=function(req,res,next){
    var id=req.params.id;
    var state=req.query.state;
    db.update(id,state,function(err,result){
        withError(err);
        console.log(result);
        res.redirect('/');
    });
};
exports.finish=finish;
//更新事项
var submit=function(req,res,next){
    var id=req.params.id;
    var title=req.body.title;
    db.updateTitle(id,title,function(err,result){
        withError(err);
        //console.log(result);
        res.redirect('/');
    });
};
exports.submit=submit;
//添加操作
var add=function(req,res,next){
    var title=req.body.title;
    var userID=req.session.user._id;
    db.insert(title,userID,function(err){
        withError(err);
        res.redirect('/');
    })
};
exports.add=add;
//首页
var index=function(req,res,next){
    var isLogined=req.session.user ? 'logined':'notLogined';
    if(isLogined=='logined'){
        var userID=req.session.user._id;
        db.findItemByUserId(userID,function(err,result){
            withError(err);
            res.render('index.ejs',{loginState:'logined',items:result,userInfo:req.session.user});
        });
    }else{
        res.redirect('/login');
    }


};
exports.index=index;
//其他情况的处理
var other=function(req,res,next){
    console.error('no router catch it');
    res.render('404.ejs',{loginState:'404'});
};
exports.other=other;

//用户注册
var register=function(req,res,next){
    res.render('register.ejs',{loginState:'notLogined'});
};
exports.register=register;
//处理用户注册逻辑
var registerPost=function(req,res,next){
    var userName=req.body.userName;
    var password=req.body.password;
    var passwordConfirm=req.body.passwordConfirm;
    var email=req.body.email;
    if(!userName||!password||!passwordConfirm){
        res.writeHead(200,{'Content-type':'text/html;charset=utf-8'});
        return res.end('用户名或密码不存在');
    }
    db.findUserByName(userName,function(err,result){
        withError(err);
        if(result==null){
            if(password!==passwordConfirm){
                res.writeHead(200,{'Content-type':'text/html;charset=utf-8'});
                return res.end('两次密码不一致');
            }else{
                var md5=crypto.createHash('md5');
                md5.update(password);
                password=md5.digest('hex');
                db.addUser(userName,password,email,function(err,result){
                    withError(err);
                    req.session.user=result;
                    res.redirect('/');
                });
            }
        }else{
            res.writeHead(200,{'Content-type':'text/html;charset=utf-8'});
            return res.end('用户名已经存在');
        }
    });
};
exports.registerPost=registerPost;
//用户登录
var login=function(req,res,next){
    res.render('login.ejs',{loginState:'notLogined'});
};
exports.login=login;
//处理用户登录逻辑
var loginPost=function(req,res,next){
   var userName=req.body.userName;
    var password=req.body.password;
    var ERRORINFO='请输入正确的用户名、密码';
    if(!userName||!password){
        res.writeHead(200,{'Content-type':'text/html;charset=utf-8'});
        return res.end(ERRORINFO);
    }
    db.findUserByName(userName,function(err,result){
        withError(err);
        if(result!=null){
            var md5=crypto.createHash('md5');
            md5.update(password);
            password=md5.digest('hex');
            if(result.password===password){
                req.session.user=result;
                res.redirect('/');
            }else{
               //res.writeHead(200,{'Content-type':'text/html;charset=utf-8'});
                res.write('<head><meta charset="utf-8"></head>');//等同于上面的那句话
                return res.end(ERRORINFO);
            }
        }else{
            res.writeHead(200,{'Content-type':'text/html;charset=utf-8'});
            return res.end(ERRORINFO);
        }
    });
};
exports.loginPost=loginPost;
var logout=function(req,res,next){
    req.session.user=null;
    res.redirect('/login');
}
exports.logout=logout;



