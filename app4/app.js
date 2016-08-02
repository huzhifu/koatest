var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router=require('./routes/router.js');
var dao=require('./dao/db.js');

var expressSession = require('express-session');


var app = express();
dao.connect();
app.on('close',function(err){
   if(err){
     throw err;
   }else{
     dao.disconnect();
   }

})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
//第一个改变点
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//express-session 中间的使用必须在 cookieParser 之后使用,原因：前者在解析cookie阶段，依赖后者
app.use(cookieParser('mistake base inside send'));
//'mistake base inside send'
// 由这个网址生成 http://preshing.com/20110811/xkcd-password-generator/
//使用 expressSession,
//需要注意的是参数
//重要的参数有 secret，resave, saveUninitailized, cookie, name
app.use(expressSession({
  secret: 'keyboard cat',   //加密解密用的秘钥
  name: 'todoList', //cookie name, //可以打开浏览器观察
  resave: true, //每次请求都重新设置session cookie，假设你的cookie是30分钟过期，每次请求都会再设置30分钟
  saveUninitialized: false, //无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
  cookie: {maxAge: 1000 * 60 * 30} //过期时间，30分钟
}));

app.use(express.static(path.join(__dirname, 'public')));

//第二个改变点
app.use('/',router);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('404.ejs',{loginState:'404'});
  //next(err);
});
//第三个添加点
// error handlers
//ejs param
var ejsParam = {
  title : "guiGu",
  message : "No Message",
  error : {
    status : "No Status",
    stack : "No Stack"
  }

};
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    //第四个改变点
    ejsParam.message = err.message;
    ejsParam.error = error;
    res.render('error', ejsParam);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  //第五个改变点
  ejsParam.message = err.message;
  ejsParam.error = {};
  res.render('error', ejsParam);
});


module.exports = app;
