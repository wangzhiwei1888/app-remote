var http = require('http');
var querystring = require('querystring');

exports.find = function(req, success) {

	var postData = querystring.stringify({
		'tel': '13521499301'
	});

	console.log(postData);

	var options = {
		host: 'apis.baidu.com',
		port: 80,
		path: '/apistore/mobilephoneservice/mobilephone?'+postData,
		method: 'GET',
		headers: {
			// 'Content-Type': 'application/x-www-form-urlencoded',
			'apikey': 'a8a643f5cd826b37fd1c55cf5fda6f57'
		}
	};
	var req = http.request(options, function(res) {
		var str = '';
		res.on('data', function(data) {

			str +=data;
		});

		res.on('end', function() {

			success(res, str);

		});

	});

	req.on('error', function(e) {
		console.log("auth_user error: " + e.message);
	});

	req.end();
}