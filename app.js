var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var querystring = require('querystring');
app.use(express.static(__dirname));
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/show', function(req, res) {
	res.sendFile(path.join(__dirname, 'show.html'));
});

app.get('/show1', function(req, res) {
	res.sendFile(path.join(__dirname, 'show1.html'));
});


app.get('/data', function(req, res, next) {
  

  var req1 = http.get("http://report.yixin.com/BIReport/htmls/js/data.json",function(res1){
  	 
  	 console.log("Got response: " + res1.statusCode);

  	res1.on('data', function (chunk) {
	    
	    chunk = JSON.parse(chunk);

	    console.log(chunk);
	    res.send(chunk);

	});


	req1.end();

  }).on('error', function(e) {

	console.log("Got error: " + e.message);

  })

});




// var sign = require('./sign');

// app.get('/api/getUser', function(req,res){

//     sign.find(req,function(res1,data){

//     	console.log(data);
//         res.send(data);

//     })

// })



var clients = {};

// var videoList = {

// 	js:['javascript','css','scss','ps','node'];

// }



//先创建一个HTTP服务器
var server = require('http').createServer(app);
//再创建socket.io服务器
var io = require('socket.io')(server);
//监听客户端的连接事件
io.on('connection', function(socket) {
	var allMsg = [];
	var username;
	
	// console.log(musicList[0]);

	// socket代表与某个客户端的连接对象
	socket.on('message', function(num) {

		

		if(!username){

			username = Math.random();
			clients[username] = socket;	

		}
		// else{
		// 	// console.log(msg)
		// 	if(msg in videoList){

		// 		allMsg = videoList[msg];
		// 	}
		// 	else{
		// 		allMsg = ['没找到'];	
		// 	}
		// }
		console.log(num);
		// console.log(musicList[num]);

		if(num != undefined)
		{
			for (var s in clients) {

				clients[s].send({
					user: username,
					data: num
				});
				
			}
		}
		else{
			for (var s in clients) {

				clients[s].send({
					user: username,
					data: "one"
				});
				
			}
		}
		

		
		

	})



});
//监听端口
server.listen(3000);