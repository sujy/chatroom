var User = require('../models/user');
var msgHandler = require('./message');

exports.handle = function(socket, message) {
	// console.log('服务器：请求注册的用户名为——' + message.data.username);
	// console.log('服务器：请求注册的密码为——' + message.data.password);
	var _source = {
		ip: message.destination.ip,
		port: message.destination.port
	};
	var _destination = {
		ip: message.source.ip,
		port: message.source.port
	};
	User.get(message.data.username, function(err, data) {
		// console.log('服务器：err->' + err + '\n服务器：data->' + data);
		if (data) {
			var _statusCode = 104;
			var _data = '用户' + message.data.username + '已经存在！请重新输入';
			var response = msgHandler.packageResponseMessage(_statusCode, _source, _destination, _data);
			console.log('服务器：用户' + message.data.username + '已经存在');
			socket.emit('response', response);
		} else {
			var newUser = new User(message.data);
			newUser.save(function(status, data) {
				var _statusCode = 100;
				var _data = '用户注册成功';
				console.log('服务器：添加用户' + message.data.username + '成功');
				var response = msgHandler.packageResponseMessage(_statusCode, _source, _destination, _data);
				socket.emit('response', response);
			});
		}
	});
};