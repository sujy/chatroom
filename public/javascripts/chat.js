(function() {
	/*********************************** variable ******************************/
	var FILE_TYPE = 'FILE';
	var TEXT_TYPE = 'TEXT';
	var FILE_LIMITSIZE = 5120000;
	var file = {
		name: '',
		file: '',
		size: 0
	};
	var socket = io();
	var IP;
	var _source;
	var _destination = {
		ip: '127.0.0.1',
		portaddr: '3000'
	};
	var _cookie = 'cookie null';
	var fileReader = new FileReader();

	/************************************ function ********************************/
	function message(type, cont, filename) {
			var content;
			var username = USERNAME;
			var date = new Date(),
				time;
			var hour = date.getHours(),
				minute = date.getMinutes(),
				seconds = date.getSeconds();
			var hour_str = (hour > 9) ? hour.toString() : ('0' + hour.toString()),
				minute_str = (minute > 9) ? minute.toString() : ('0' + minute.toString()),
				seconds_str = (seconds > 9) ? seconds.toString() : ('0' + seconds.toString());
			switch (type) {
				case FILE_TYPE:
					content = {
						type: FILE_TYPE,
						filename: filename,
						filesize: file.size,
						content: cont
					};
					break;
				case TEXT_TYPE:
					content = {
						type: TEXT_TYPE,
						content: cont
					};
					break;
			}

			if (hour > 12) {
				time = hour_str + ':' + minute_str + ':' + seconds_str + '  PM';
			} else {
				time = hour_str + ':' + minute_str + ':' + seconds_str + '  AM';
			}

			return packageMessage(
				'broadcast',
				_source,
				_destination,
				_cookie, {
					username: username,
					time: time,
					content: content
				}
			);
		}

	/**
	 *  清屏函数
	 **/
	function cleanScreen() {
		$('#chat-dynamic').empty();
		$('#chat-dynamic').append("<p style='font-weight:bold;font-size:20px;text-align:center;')> 系统：欢迎来到聊天室大厅</p>");
	}

	/*	*
	 *	get online chaters list
	 * return
	 **/
	function getChatList() {
		socket.emit('message', packageMessage(
			'list',
			_source,
			_destination,
			_cookie,
			'null'
		));
	}


	/**
	 * 文件检测函数
	 **/
	function isFileExist() {
		return $("#file-upload").val() !== '';
	}



	/**
	 *  消息发送函数
	 **/
	function sendMessage() {
		var startPoint = 0,
			endPoint = file.size;
		var FINISHREAD = true;
		if ($("#file-upload").val() !== '') {
			/**
			 * 这里是用的一个闭包方法取消忙等待
			 **/
			fileRead(fileSplice(startPoint, endPoint, file.file));
		} else {
			socket.emit('message', message(TEXT_TYPE, $('#message-box input').val()));
		}

		$('#message-box input').val('');
		$('#file-upload').val('');

		fileReader.onprogress = function(event) {
			console.log(event.lengthComputable, event.loaded, event.total);
		};

		fileReader.onerror = function() {
			console.log("something wrong, CODE: " + fileReader.error.code);
		};

		fileReader.onload = function() {
			// 每一个chunk load完发送进入load下一块chunk的过程
			socket.emit('message', message(FILE_TYPE, {
				data: fileReader.result,
				Final: startPoint + FILE_LIMITSIZE >= endPoint ? true : false
			}, file.name));
			FINISHREAD = true;
			startPoint += FILE_LIMITSIZE;
			return fileRead(fileSplice(startPoint, endPoint, file.file));

		};

		/**
		 * 文件读取函数
		 **/
		function fileRead(f) {
			if (FINISHREAD) {
				if (f.size !== 0) {
					fileReader.readAsBinaryString(f);
					FINISHREAD = false;
				}
			}
		}

		/**
		 * 文件分块函数
		 **/
		function fileSplice(startPoint, endPoint, f) {
			try {
				if (f.slice) {
					return f.slice(startPoint, startPoint + Math.min(endPoint - startPoint, FILE_LIMITSIZE));
				}
			} catch (e) {
				console.log(e);
				alert('你的浏览器不支持上传');
			}
		}

	}

	/**
	 *  消息框更新函数
	 **/
	function updateMessageBox(message) {
		switch (message.content.type) {
			case FILE_TYPE:
				updateMessageBox_File(message);
				break;
			case TEXT_TYPE:
				updateMessageBox_Text(message);
				break;
		}
	}
	function updateMessageBox_File(message) {
		$('#chat-dynamic').append('<p><b>(' + message.time + ') ' + message.username  +
			' : </b>' + message.content.filename  +
			'<a target="_blank" href=' + message.address + '>' + ' 下载 </a>' + '</p>');
		var scrollHeight = $('#chat-dynamic').height() - $('#chat-box').height();
		$('#chat-box').scrollTop(scrollHeight);
	}

	function updateMessageBox_Text(message) {
		$('#chat-dynamic').append('<p><b>(' + message.time + ') ' + message.username + ' : </b>' + message.content.content + '</p>');
		var scrollHeight = $('#chat-dynamic').height() - $('#chat-box').height();
		$('#chat-box').scrollTop(scrollHeight);
	}

	/**
	 *	updateChatList() function
	 *
	 **/
	function updateChatList(namelist) {
		if (namelist === undefined) return;
		var chatlist = "";
		for (var i = 0; i < namelist.length; i++) {
			chatlist = chatlist + "<tr><td width='100px'>" + namelist[i] + "</td></tr>";
		}
		$('#chat-list').html(chatlist);
	}

	/*************************************** Event ********************************/

	socket.on('welcome', function(ip) {
		IP = ip;
		_source = {
			ip: IP,
			portaddr: '8888'
		};
		getChatList();
	});

	socket.on('response', function(response) {
		switch (response.statusCode) {
			case 400:
				updateChatList(response.data);
				break;
			case 404:
				handleChatListError();
				break;
			case 500:
				updateMessageBox(response.data);
				break;
		}
	});

	//主动获取chatList
	$(document).ready(function(){  
    setUser();
    getChatList();  
	}); 
	/**
	 *  发送消息
	 **/
	//按下Enter
	$('#message-box input').keydown(function(e) {
		if (e.keyCode === 13) {
			$('#send-message').click();
		}
	});
	//点击发送按钮
	$('#send-message').click(function() {
		if (isFileExist()) {
			//console.log($("#file-upload")[0].files);
			//fileRead();
			sendMessage();
		} else {
			sendMessage();
		}
	});

	/**
	 *  清除屏幕现有消息
	 **/
	//按下Esc
	$('body').keydown(function(e) {
		if (e.keyCode === 27) {
			$('#clean-box').click();
		}
	});

	//点击清屏按钮
	$('#clean-box').on('click', cleanScreen);

	// 改变input file
	$("#file-upload").change(function() {
		if ($('#file-upload').val() !== null) {
			file.name = ($("#file-upload")[0].files)[0].name;
			file.file = ($("#file-upload")[0].files)[0];
			file.size = file.file.size;
			console.log(file);
			//fileRead();
		} else {
			file = {
				name: '',
				file: '',
				size: 0
			};
		}
	});


})();