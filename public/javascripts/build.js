(function() {
	/*********************************** variable ******************************/
	var socket = io();
	var IP;
	var _source;
	var _destination = {
		ip: '127.0.0.1',
		portaddr: '3000'
	};
	var _cookie = 'cookie null';


	/************************************ function ********************************/
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
	 *  消息发送函数
	 **/
	function sendMessage() {
		var username = USERNAME;
		var date = new Date(),
			time;
		var hour = date.getHours(),
			minute = date.getMinutes(),
			seconds = date.getSeconds();
		var hour_str = (hour > 9) ? hour.toString() : ('0' + hour.toString()),
			minute_str = (minute > 9) ? minute.toString() : ('0' + minute.toString()),
			seconds_str = (seconds > 9) ? seconds.toString() : ('0' + seconds.toString());
		var content = $('#message-box input').val();

		// if(content === '') {
		// 	alert('消息内容不能为空');
		// 	return;
		// }

		if (hour > 12) {
			time = hour_str + ':' + minute_str + ':' + seconds_str + '  PM';
		} else {
			time = hour_str + ':' + minute_str + ':' + seconds_str + '  AM';
		}

		var message = packageMessage(
			'broadcast',
			_source,
			_destination,
			_cookie, {
				username: username,
				time: time,
				content: content
			}
		);

		socket.emit('message', message);
		$('#message-box input').val('');
	}

	/**
	 *  消息框更新函数
	 **/
	function updateMessageBox(message) {
		$('#chat-dynamic').append('<p><b>(' + message.time + ') ' + message.username + ' : </b>' + message.content + '</p>');
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
		sendMessage();
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
})();;(function() {
	var socket = io();
	socket.on('welcome', function(ip) {
		$('#register-apply').on('click', function() {
			var username = $('#register-username input').val();
			var password = $('#register-password input').val();
									USERNAME = username;
			var passwordComfirm = $('#register-password-confirm input').val();
			console.log('username:' + username + '|password:' + password + '|passwordComfirm:' + passwordComfirm);
			if ((password === '') || (username === '')) {
				alert('密码和用户名不能为空，请重新输入！');
				clear();
			} else {
				if (password.length < 6) {
					alert('密码至少为6位，请重新输入！');
					clear();
				} else {
					if (password == passwordComfirm) {
						var user = {
							username: username,
							password: password
						};
						var sourceIp = ip;
						console.log(sourceIp);
						var _source = {
							ip: sourceIp,
							portaddr: '8888'
						};
						var _destination = {
							ip: '127.0.0.1',
							portaddr: '3000'
						};
						var _cookie = 'cookie null';
						var message = packageMessage('register', _source, _destination, _cookie, user);
						console.log(message);
						console.log(user);

						socket.emit('message', message);
					} else {
						alert('两次输入密码不一致，请重新输入！');
						clear();
					}
				}
			}

		});

		socket.on('response', function(response) {
			if (response.statusCode == 104) {
				alert(response.data);
				clear();
				$('#register-username input').val('');
			}
			if (response.statusCode == 100) {
				alert('恭喜！注册成功！');
				window.location = '/chat';
			}
		});
	});

	function clear() {
		$('#register-password input').val('');
		$('#register-password-confirm input').val('');
	}
})();