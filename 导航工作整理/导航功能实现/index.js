//������Ӧ��ģ�飬���ʹ�õ���postgresql���ݿ⣬��˼��ص�ģ����pg��ʹ�ò�ͬ�����ݿ���Լ�����Ӧ
��ģ��
var pg = require('pg');

//�����ڲ�ģ��
var server = require("./server");
var router = require("./router");
var func = require("./function");

//��url·����Ӧ����Ӧ�ĺ���
var handle = {};
handle["/"] = func.select;
handle["/select"] = func.select;

//�����������ݿ�������ַ�����"tcp://�û���:����@ip/��Ӧ�����ݿ���"
var conString = "tcp://postgres:postgres@localhost/my";
var client = new pg.Client(conString);  //����һ�����ݿ����

//�������ݿ⣬���ӳɹ���ִ�лص�����
client.connect(function(error, results) {
     if(error){
            console.log('ClientConnectionReady Error: ' + error.message);
            client.end();
            return;
        }
        console.log("client.connect OK.\n");
    server.start(client,router.route,handle); //����server
});