/**
 * Created by os-huzp on 2016/8/1.
 */
var http = require('http');

http.createServer(function(req,res){
    res.writeHeader(200, { 'Content-Type': 'text/html;charset=utf-8' });
    res.end('<h1>白日依山尽，黄河入海流</h1>');
}).listen(3000);