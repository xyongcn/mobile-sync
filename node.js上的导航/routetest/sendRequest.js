
var xmlHttp = null;
function getXMLHttpRequest(){
	var xmlHttp = null;
	try{
		xmlHttp = new XMLHttpRequest();
	}
	catch(e){
		 try{
			xmlHttp = new ActiveXObject("Msxml2.XMLHttp");
 		}
		 catch(e){
		 	try{
		 		xmlHttp = new ActiveXObject("Microsoft.XMLHttp");
		 	}
		 	catch(e){
				xmlHttp = false;
  			}
		}
	}
	return xmlHttp;
}
                        
function sendRequest(data,url,updatePage){
	xmlHttp = getXMLHttpRequest();
	if(xmlHttp == false){
		alert("xmlHttpRequest支持有问题");
		return;
	}
	var post = "data="+data;
	 xmlHttp.open("POST",url,true);
	xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
	xmlHttp.onreadystatechange = updatePage;
	xmlHttp.send(post);
	alert(post);
}
                        