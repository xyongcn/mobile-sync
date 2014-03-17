function select(client,response)
{
    console.log("Request handler 'select' was called.");
    //执行相应的sql语句
    client.query("select * from teacher;",function(error,results){
        console.log("in callback function.\n");
        if (error)
        {
            console.log("error");
            console.log('GetData Error: ' + error.message);
            client.end();
            return;
        }
        if(results.rowCount > 0)
        {
            //callback(results);
            //指定为json格式输出
            response.writeHead(200,{"Content-Type":"application/json"});       

            //先将results 字符串内容转化成json格式，然后响应到浏览器上

 response.write(JSON.stringify(results)); response.end(); } });}

exports.select = select;