var User = require('../models/user');
var msgHandler = require('./message');

exports.handle = function(socket, message){
	var _source = {
		ip: message.destination.ip,
		port: message.destination.port
	};
	var _destination = {
		ip: message.source.ip,
		port: message.source.port
	};
	var _statusCode = 204;
	var _data = '';
	var response = msgHandler.packageResponseMessage(_statusCode, _source, _destination, _data);
	User.get(message.data.username, function(err, data){
		if(data){
			console.log('找到用户');
			if(data.password == message.data.password){
				_statusCode = 200;
				_data = '登陆成功，欢迎'+ message.data.username +'！';
			} else {
				_statusCode = 204;
				_data = '用户密码错误，请重试！';
			}
			response = msgHandler.packageResponseMessage(_statusCode, _source, _destination, _data);
			console.log(response);
			socket.emit('response', response);
		} else {
			console.log('找不到用户');
			_statusCode = 204;
			_data = '用户不存在，请先注册！';
			response = msgHandler.packageResponseMessage(_statusCode, _source, _destination, _data);
			socket.emit('response', response);
		} 
	});
};