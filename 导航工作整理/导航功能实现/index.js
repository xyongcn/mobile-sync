//加载相应的模块，这儿使用的是postgresql数据库，因此加载的模块是pg。使用不同的数据库可以加载相应
的模块
var pg = require('pg');

//加载内部模块
var server = require("./server");
var router = require("./router");
var func = require("./function");

//将url路径对应到相应的函数
var handle = {};
handle["/"] = func.select;
handle["/select"] = func.select;

//构造连接数据库的连接字符串："tcp://用户名:密码@ip/相应的数据库名"
var conString = "tcp://postgres:postgres@localhost/my";
var client = new pg.Client(conString);  //构造一个数据库对象

//连接数据库，连接成功，执行回调函数
client.connect(function(error, results) {
     if(error){
            console.log('ClientConnectionReady Error: ' + error.message);
            client.end();
            return;
        }
        console.log("client.connect OK.\n");
    server.start(client,router.route,handle); //启动server
});