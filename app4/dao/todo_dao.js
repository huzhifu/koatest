/**
 * Created by 胡志甫 on 2016/6/10.
 */
var db=require('./db.js');
db.connect();
function withError(err){
    if(err){
        return console.error(err);
    }
}
/*db.insert('吃饭',function(err,record){
    withError(err);
    console.log(record.title+':insert success!');
});*/
db.deleteOne('睡觉',function(err,result){
    withError(err);
    console.log(result);
});
/*
db.update('吃饭',{title:'睡觉'},function(err,result){
    withError(err);
    console.log(result);
})*/
/*db.selectById('吃饭',function(err,result){
    withError(err);
    console.log(result);
});*/
/*db.selectAll(function(err,result){
    withError(err);
    console.log(result);
});*/
