var path = require('path');

exports.getConType=function(filePath){
    var contentType="";
    //使用路径解析模块获取文件扩展名
    var extension=path.extname(filePath);
    switch(extension){
        case ".html":
            contentType= "text/html";
            break;
        case ".js":
            contentType="text/javascript";
            break;
        case ".css":
            contentType="text/css";
            break;
        case ".gif":
            contentType="image/gif";
            break;
        case ".jpg":
            contentType="image/jpeg";
            break;
        case ".png":
            contentType="image/png";
            break;
        case ".ico":
            contentType="image/icon";
            break;
        default:
        contentType="application/octet-stream";
    }
    return contentType; //返回内容类型字符串
}