var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');
var getCType=require('./getConType');
var pg = require('pg');

var server = http.createServer();

var pgrouting = function(req,res){
	var info ="";
	req.addListener('data', function(chunk){
		info += chunk;
    	 })
    	 .addListener('end', function(){
		var conString = "postgres://postgres:123@localhost/mydatabase";
		var client = new pg.Client(conString);
		client.connect();
		
		info = querystring.parse(info);
		var route = JSON.parse(info.data);
		
		query = client.query("select r.id2,s1.x1,s1.y1,s1.x2,s1.y2 from pgr_dijkstra('select id,source::integer,target::integer, length::double precision as cost from beijingpbf',"+route.id1+","+route.id2+",false,false) AS r INNER JOIN beijingpbf as s1 ON r.id2=s1.id");
 		query.on("row", function (row, result) {
   		 	result.addRow(row);
		});
		query.on("end", function (result) {
   		 	var json_res = JSON.stringify(result.rows, null, "    ");
   			 res.write(json_res);
    			client.end();
    			res.end();
		});
	})
}
var fileRequest = function(filePath,res){
	fs.readFile(filePath, 'utf-8',function (err, data) {//读取内容
		if (err) throw err;
		 res.writeHead(200, {"Content-Type":getCType.getConType(filePath)});//注意这里
		 res.write(data);
		 res.end();
        });
}

var judge = function(req,res){
	var info ="";
	req.addListener('data', function(chunk){
		info += chunk;
    	 })
    	 .addListener('end', function(){
		var conString = "postgres://postgres:123@localhost/mydatabase";
		var client = new pg.Client(conString);
		client.connect();
		
		info = querystring.parse(info);
		console.log(info);
		
		
		var body = '<body onload=onStart()>'+  		
		'<input id="id1" type = "text" value='+info.id1+'>'+
		'</input>'+
		'<input id="id2" type = "text" value='+info.id2+'>'+
		'</input>'+
		'<input type = "button" value = "submit" onclick = "onStart()">'+
		'</input>'+
		'<div id="map" >'+
		'</div>'+
		'<li id = "text1" >'+
			'test1'+
		'</li>'+	
		'</body>'+
		'</html>';
		
		query = client.query("select r.id2,s1.x1,s1.y1,s1.x2,s1.y2 from pgr_dijkstra('select id,source::integer,target::integer, length::double precision as cost from beijingpbf',"+info.id1+","+info.id2+",false,false) AS r INNER JOIN beijingpbf as s1 ON r.id2=s1.id");
 		query.on("row", function (row, result) {
   		 	result.addRow(row);
		});
		query.on("end", function (result) {
			console.log(result.rowCount);
   		 	if(result.rowCount >=230){
   		 		fs.readFile('./geoserver.txt', 'utf-8',function (err, data) {//读取内容
					if (err) throw err;
					 res.writeHead(200, {"Content-Type":"text/html"});
					 res.write(data);
					 res.write(body);
		 			res.end();
       				 });
   		 		
   		 	}
   		 	else{
   		 		fs.readFile('./openlayers.txt', 'utf-8',function (err, data) {//读取内容
					if (err) throw err;
					 res.writeHead(200, {"Content-Type":"text/html"});
					 res.write(data);
					 res.write(body);
		 			res.end();
       				 });
   		 	}
    			client.end();
		});
	})
}

var requestFunction = function (req, res){
	console.log(req.url);
	if(req.url == '/'){
		return fileRequest('./original.html',res);
	}
	else if(req.url == '/routing'){
		return pgrouting(req,res);
	}
	else if(req.url == '/judge'){
		return judge(req,res);
	}
	else{
		return fileRequest('./'+req.url,res);
	}
}


server.on('request',requestFunction);

server.listen(1337, "127.0.0.1");

console.log('Server running at http://127.0.0.1:1337/');