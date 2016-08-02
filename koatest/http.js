/**
 * Created by itsx02 on 2016/8/2.
 */
var http=require('http');
var koa=require('koa');
var app=koa();
app.use(function *() {
    this.body='My name is http';
})
http.createServer(app.callback()).listen(3000);
http.createServer(app.callback()).listen(3005);