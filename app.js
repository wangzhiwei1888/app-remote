var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var querystring = require('querystring');
app.use(express.static(__dirname));
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

var sign = require('./sign');

app.get('/api/getUser', function(req,res){

    sign.find(req,function(res1,data){

    	console.log(data);
        res.send(data);

    })

})

app.get('/search/:text',function(req,response){


 	var searchStr = req.params.text;

 	// res.send(searchStr);

 	// var postData = querystring.stringify({
 	//   'query' : '喜欢的同义词',
 	//   'resource':'zici'
 	// });

 	var postData = {
 	  'query' : searchStr,
 	  'resource':'video_haiou'
 	};

 	postData = JSON.stringify(postData);

 	console.log(postData)

 	var options = {
 	  hostname: 'apis.baidu.com',
 	  path: '/baidu_openkg/shipin_kg/shipin_kg',
 	  method: 'POST',
 	  headers: {
 	    'Content-Type': 'application/x-www-form-urlencoded',
 	    'apikey':'a8a643f5cd826b37fd1c55cf5fda6f57',
 	    'charset':'utf8'
 	  }
 	};

 	var req1 = http.request(options, (res) => {
 	  // console.log(`STATUS: ${res.statusCode}`);
 	  // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
 	  res.setEncoding('utf8');

 	  // console.log(res);
 	  var str = ''
 	  res.on('data', (chunk) => {
	  	
 	    console.log(`BODY: ${chunk}`);
 	    str += chunk;

 	  });
 	  res.on('end', () => {

 	    console.log('No more data in response.')
 	    response.end(str);

 	  })

 	});

 	req1.on('error', (e) => {
 	  console.log(`problem with request: ${e.message}`);
 	});


 	req1.write(postData);
 	req1.end();
	

 })



var clients = {};

var videoList = {

	js:['javascript','css','scss','ps','node'];

}



//先创建一个HTTP服务器
var server = require('http').createServer(app);
//再创建socket.io服务器
var io = require('socket.io')(server);
//监听客户端的连接事件
io.on('connection', function(socket) {
	var allMsg = [];
	var username;
	// socket代表与某个客户端的连接对象
	socket.on('message', function(msg) {

		console.log(msg);

		if(!username){

			username = Math.random();
			clients[username] = socket;	

		}
		else{
			// console.log(msg)
			if(msg in videoList){

				allMsg = videoList[msg];
			}
			else{
				allMsg = ['没找到'];	
			}
			
				
		}
		
		


		for (var s in clients) {
			clients[s].send({
				user: username,
				msg: allMsg
			});
		}



	})



});
//监听端口
server.listen(3000);