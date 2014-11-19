(function() {
	var socket = io();
	/**
	 *  清屏函数
	 **/
	var cleanScreen = function() {
		$('#chat-dynamic').empty();
		$('#chat-dynamic').append("<p style='font-weight:bold;font-size:20px;text-align:center;')> 系统：欢迎来到聊天室大厅</p>");
	};
	/**
	 *  消息发送函数
	 **/
	var sendMessage = function() {
		var username = 'test';
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

		var message = {
			username: username,
			time: time,
			content: content
		};

		socket.emit('chat', message);
		$('#message-box input').val('');
	};

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
	//滚动条自动滚动
	socket.on('chat', function(message) {
		$('#chat-dynamic').append('<p><b>(' + message.time + ') ' + message.username + ' : </b>' + message.content + '</p>');
		var scrollHeight = $('#chat-dynamic').height() - $('#chat-box').height();
		$('#chat-box').scrollTop(scrollHeight);
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
})();