var msgHandler = require('./message');
var fs = require('fs');
var FILE_TYPE = 'FILE';
var TEXT_TYPE = 'TEXT';
var UPLOAD_PATH = './upload/';
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
	console.log(message.data.content.content.Final);
	switch (message.data.content.type) {
		case FILE_TYPE:
			fileHandler(message);
			break;
		case TEXT_TYPE:
			textHandler(message);
			break;
	}

	var response = msgHandler.packageResponseMessage(
		_statusCode,
		_source,
		_destination,
		message.data
	);
	//socket.broadcast.emit('response', response);
	//socket.emit('response', response);
};

/**
	*	File Handle Function
	*	Return Response
**/
function fileHandler(message) {
	// fs.writeFile(UPLOAD_PATH + message.data.content.filename, message.data.content.content,
	// 	{encoding: 'Binary'},
	// 	function(err, written){
	// 	console.log(err, written);
	// });
	// var data = {
	// 	fileName : message.data.content.filename
	// };
}

function textHandler(message) {

}