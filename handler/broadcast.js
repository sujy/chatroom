var msgHandler = require('./message');
var fs = require('fs');
var FILE_TYPE = 'FILE';
var TEXT_TYPE = 'TEXT';
var UPLOAD_PATH = './upload/';
/**
 *	File 代表上传文件的信息
 *	同时为多文件上传提供可能
 *	File_End 代表文件是否完结
 *	fileUploadPionter 为已经上传的内容
 *	writeStream 是文件的流
 **/
var File = [];
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
			/** initialize **/
			if (!File[message.data.content.filename]) {
				File[message.data.content.filename] = {
					File_End: true,
					FileUploadPionter: 0,
					writeStream: null
				};
			}

			if (File[message.data.content.filename].writeStream === undefined || File[message.data.content.filename].File_End) {
				File[message.data.content.filename] = {
					File_End: false,
					FileUploadPionter: 0,
					writeStream: fs.createWriteStream(UPLOAD_PATH +
						message.data.content.filename, {
							encoding: 'Binary'
						})
				};
			}
			response = msgHandler.packageResponseMessage(
				_statusCode,
				_source,
				_destination,
				fileHandler(message,
					File[message.data.content.filename].writeStream));
			if (File[message.data.content.filename].File_End) {
				File[message.data.content.filename].writeStream.end();
				delete File[message.data.content.filename];

			}
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
	writeStream.write(message.data.content.content.data, 'Binary', function() {
		if (message.data.content.content.Final) {
			writeStream.on('end', function() {
				writeStream.end();
			});
		}
	});
	console.log(File);
	File[message.data.content.filename].FileUploadPionter += message.data.content.content.data.length;
	var responseData = {
		username: message.data.username,
		time: message.data.time,
		content: {
			type: FILE_TYPE,
			content: '文件 ' + message.data.content.filename + ' 已上传 ： ' +
				Math.floor((File[message.data.content.filename].FileUploadPionter /
					message.data.content.filesize) * 100) + "%"
		}
	};
	if (message.data.content.content.Final) {
		File[message.data.content.filename].FileUploadPionter = 0;
		File[message.data.content.filename].File_End = true;
	}
	return responseData;
}

/**
 *	Text Handle Function
 *	Return Response.data
 **/
function textHandler(message) {
	console.log(message.data);
	return message.data;
}