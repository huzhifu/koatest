/**
 * Created by itsx02 on 2016/8/2.
 */
var koa=require('koa');
var app=koa();
app.use(function *() {
    this.body='下雨天，怎么办！';
});
app.listen(3000,function () {
    console.log('connect to localhost:3000 success!');
});

