function select(client,response)
{
    console.log("Request handler 'select' was called.");
    //ִ����Ӧ��sql���
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
            //ָ��Ϊjson��ʽ���
            response.writeHead(200,{"Content-Type":"application/json"});       

            //�Ƚ�results �ַ�������ת����json��ʽ��Ȼ����Ӧ���������

 response.write(JSON.stringify(results)); response.end(); } });}

exports.select = select;