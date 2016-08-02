/**
 * Created by 胡志甫 on 2016/6/10.
 */
var mongoose=require('mongoose');
var connect=function(){
    mongoose.connect('mongodb://localhost/emp');
    var conn=mongoose.connection;
    conn.once('open',function(){
        console.log('opend');
    });
    conn.on('error',function(){
        console.log('对不起，链接故障！！');
    })
}
var disconnect=function(){
    mongoose.disconnect();
}
//callback处理函数
function callback(err,obj,cb){
    if(err){
        console.log('对不起，连接错误！！');
        // return cb(err);
    }
    cb(null,obj);
}
//自定义连接接口
exports.connect=connect;
//自定义断开连接接口
exports.disconnect=disconnect;
var schema=mongoose.Schema({
    userID:String,
    title:String,
    finish_state:{type:Number,default:1},//1代表未完成，2代表已完成
    post_date:{type:Date,default:Date.now()}
});

var todo=mongoose.model('todo',schema);
var insert=function(title,userID,cb){
    var t1=new todo({
        title:title,
        userID:userID
    });
    t1.save(function(err,t1){
        callback(err,t1,cb);//使用callback函数
    });
};
//自定义插入接口
exports.insert=insert;
var findItemByUserId=function(id,cb){
    todo.find({userID:id},function(err,result){
        callback(err,result,cb);//使用callback函数
    })
};
//根据用户Id查找Item
exports.findItemByUserId=findItemByUserId;
var selectAll=function(cb){
    todo.find({},function(err,todo){
        callback(err,todo,cb);//使用callback函数
    });
}
//自定义查询全部接口
exports.selectAll=selectAll;
var selectById=function(id,cb){
    todo.find({_id:id},function(err,todo){
        callback(err,todo,cb);//使用callback函数
    });
}
//自定义查询单条记录接口
exports.selectById=selectById;
var deleteOne=function(id,cb){
    todo.find({_id:id},function(err,todo){
        if(err){
            return cb(err);
        }
        if(todo[0]){
            todo[0].remove();
            cb(null,'删除成功');
        }else{
            cb(null,'删除失败');
        }
    });
};
//自定义删除单条记录接口
exports.deleteOne=deleteOne;
var update=function(id,state,cb){
    todo.find({_id:id},function(err,todo){
        if(err){
            return cb(err);
        }
        if(todo[0]){
            todo[0].finish_state=state=='yes'?2:1;
            todo[0].post_date=Date.now();
            todo[0].save(function(err){
               if(err){
                   return cb(err);
               }
            });
            cb(null,'更新成功！');
        }
        else{
            cb(null,'更新失败');
        }
    });
};
//自定义更新接口
exports.update=update;
var updateTitle=function(id,title,cb){
    todo.find({_id:id},function(err,todo){
        if(err){
            return cb(err);
        }
        if(todo[0]){
            todo[0].title=title;
            todo[0].post_date=Date.now();
            todo[0].save(function(err){
                if(err){
                    return cb(err);
                }
            });
            cb(null,'更新成功！');
        }
        else{
            cb(null,'更新失败');
        }
    });
};
//自定义更新接口
exports.updateTitle=updateTitle;
/////////////////////////////////下面用到的是用户集合/////////////
var userSchema=mongoose.Schema({
    userName:String,
    password:String,
    email:String,
    regDate:{type:Date,default:Date.now()},
    avatar:String,
    avatarFileName:String
});
var user=mongoose.model('user',userSchema);
var addUser=function(name,password,email,cb){
    var u=new user({
        userName:name,
        password:password,
        email:email
    });
    u.save(function(err,result){
        callback(err,result,cb);
    });
};
//添加一条用户信息
exports.addUser=addUser;
var findUserByName=function(name,cb){
   user.findOne({userName:name},function(err,result){
       callback(err,result,cb);
   })

}
//按照用户名查找接口
exports.findUserByName=findUserByName;

var updateAvatar=function(userID,avatarFileName,cb){
    findUserById(userID,function(err,result){
        if(err){
            return console.error(err);
        }
        result.avatar='uploaded';
        result.avatarFileName=avatarFileName;
        result.save(function(err,userInfo){
            callback(err,userInfo,cb);
        })
    })
};
exports.updateAvatar=updateAvatar;
var findUserById=function(userID,cb){
    user.findOne({_id:userID},function(err,result){
       callback(err,result,cb);
    });
};