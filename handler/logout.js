var User = require('../models/user');
var msgHandler = require('./message');

exports.handle = function(socket, message, chatList){
	var _source = {
		ip: message.destination.ip,
		port: message.destination.port
	};
	var _destination = {
		ip: message.source.ip,
		port: message.source.port
	};
	var _statusCode = 300;
	var _data = 'logout success!';
	
	chatList.remove(message.data);
	response = msgHandler.packageResponseMessage(_statusCode, _source, _destination, _data);
	socket.emit('response', response);
	
};