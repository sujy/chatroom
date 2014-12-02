var msgHandler = require('./message');

exports.handle = function(socket, message) {
	var _source = {
		ip: message.destination.ip,
		port: message.destination.port
	};
	var _destination = {
		ip: message.source.ip,
		port: message.source.port
	};

	var _statusCode = 500;

	var response = msgHandler.packageResponseMessage(
		_statusCode,
		_source,
		_destination,
		message.data
	);

	socket.broadcast.emit('response', response);
	socket.emit('response', response);
};