function route(client,handle,pathname,response){
    console.log("About to route a request for " + pathname);

    if(typeof handle[pathname] === 'function'){
        handle[pathname](client,response);  //执行对应的函数
    }else{
        console.log("No request handle found for " + pathname +'\n');
        response.writeHead(404,{"Content-Type":"text/plain"});
        response.write("404 Not found");
        response.end();
    }
}

exports.route = route;