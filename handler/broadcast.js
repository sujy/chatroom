var msgHandler = require('./message');
var fs = require('fs');
var FILE_TYPE = 'FILE';
var TEXT_TYPE = 'TEXT';
var UPLOAD_PATH = './upload/';
var writeStream = null;
var File_End = true;
/*	指已上传的大小	*/
var FileUploadPionter = 0;
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
	var response;
	switch (message.data.content.type) {
		case FILE_TYPE:
			if (!writeStream || File_End) {
				writeStream = fs.createWriteStream(UPLOAD_PATH + message.data.content.filename, {
					encoding: 'Binary'
				});
				File_End = false;
			}
			response = msgHandler.packageResponseMessage(
				_statusCode,
				_source,
				_destination,
				fileHandler(message, writeStream));
			break;
		case TEXT_TYPE:
			response = msgHandler.packageResponseMessage(
				_statusCode,
				_source,
				_destination,
				textHandler(message));
			break;
	}

	// var response = msgHandler.packageResponseMessage(
	// 	_statusCode,
	// 	_source,
	// 	_destination,
	// 	message.data
	// );
	socket.broadcast.emit('response', response);
	socket.emit('response', response);
};

/**
 *	File Handle Function
 *	Return Response.data
 **/
function fileHandler(message, writeStream) {
	console.log(message.data.content.filesize);
	writeStream.write(message.data.content.content.data, 'Binary', function() {
		if (message.data.content.content.Final) {
			writeStream.on('end', function() {
				writeStream.end();
			});
		}
	});

	FileUploadPionter += message.data.content.content.data.length;
	var responseData = {
		username: message.data.username,
		time: message.data.time,
		content: {
			type: FILE_TYPE,
			content: '文件 ' + message.data.content.filename + ' 已上传 ： ' +
			Math.floor((FileUploadPionter / message.data.content.filesize) * 100) + "%"
		}
	};
	if (message.data.content.content.Final) {
		FileUploadPionter = 0;
		File_End = true;
	}
	return responseData;
	// fs.writeFile(UPLOAD_PATH + message.data.content.filename, message.data.content.content,
	// 	{encoding: 'Binary'},
	// 	function(err, written){
	// 	console.log(err, written);
	// });
	// var data = {
	// 	fileName : message.data.content.filename
	// };
}

/**
 *	Text Handle Function
 *	Return Response.data
 **/
function textHandler(message) {
	console.log(message.data);
	return message.data;
}