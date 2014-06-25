var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');
var getCType=require('./getConType');
var pg = require('pg');

var server = http.createServer();
var fileRequest = function(filePath,res){
	fs.readFile(filePath, 'utf-8',function (err, data) {//读取内容
		if (err) throw err;
		 res.writeHead(200, {"Content-Type":getCType.getConType(filePath)});//注意这里
		 res.write(data);
		 res.end();
        });
}

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
		
		query = client.query("select r.id2,s1.x1,s1.y1,s1.x2,s1.y2,s1.time from pgr_dijkstra('select id,source::integer,target::integer, time::double precision as cost from beijingtest10',"+route.id1+","+route.id2+",false,false) AS r INNER JOIN beijingtest10 as s1 ON r.id2=s1.id");
		
 		query.on("row", function (row, result) {
   		 	result.addRow(row);
		});
		query.on("end", function (result) {
			var json_res = JSON.stringify(result.rows, null, "    ");
			//console.log(result);
			//console.log(json_res);
			if(result.rowCount < 0){
				res.write("geoserver--");
				fs.readFile('./Func/geoserver2.js', 'utf-8',function (err, data) {//读取内容
					if (err) throw err;
					 res.write(data);
					 res.end();
      			  	});
      			}
      			else{
      				res.write("openlayers--");
      				res.write(json_res);
      				res.write("--");
      				fs.readFile('./Func/openlayers2.js', 'utf-8',function (err, data) {//读取内容
					if (err) throw err;
					 res.write(data);
					 res.end();
      			  	});
      			}
    			client.end();
		});
	})
}

var pgZone = function(req,res){
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
		var x = route.x*100;
		var y = route.y*100;
		var zonenum = parseInt(x.toFixed(0)*100000)+parseInt(y.toFixed(0));
		query = client.query(" select id,x1,y1,x2,y2,time from beijingtestzone where zonenum="+zonenum+"OR zonenum2 ="+zonenum);
 
 		query.on("row", function (row, result) {
   		 	result.addRow(row);
		});
		query.on("end", function (result) {
			var json_res = JSON.stringify(result.rows, null, "    ");
			//console.log(result);
			//console.log(json_res);
			if(result.rowCount < 0){
				res.write("geoserver--");
				fs.readFile('./Func/geoserver2.js', 'utf-8',function (err, data) {//读取内容
					if (err) throw err;
					 res.write(data);
					 res.end();
      			  	});
      			}
      			else{
      				res.write(json_res);
      				res.end();
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
	else if(req.url=="/mouseClick"){
		return pgZone(req,res);
	}
	else{
		return fileRequest('./'+req.url,res);
	}
}


server.on('request',requestFunction);

server.listen(1337, "127.0.0.1");

console.log('Server running at http://127.0.0.1:1337/');