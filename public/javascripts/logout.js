(function() {
	var socket = io();
	var _source = '';
	var _destination = '';
	var _cookie = 'null cookie';
	var _data = '';
	//welcome socket
	socket.on('welcome', function(userIp) {
		_source = {
			ip: userIp,
			portaddr: '8888'
		};
		_destination = {
			ip: '127.0.0.1',
			portaddr: '3000'
		};

		//登出时间触发
		$('#logout').on('click', function() {
			var _username = $('#login-user input').val();
			var _password = $('#login-password input').val();
			//login data
			_data =  getUser();
			//package message
			var message = packageMessage('logout', _source, _destination, _cookie, _data);
			//emit
			socket.emit('message', message);
		});

		//接受报文
		socket.on('response', function(response) {
			console.log(response);
			if (response.statusCode == 304) {
				alert(response.data);
			}
			if (response.statusCode == 300) {
				alert('退出成功，欢迎下次再来！');
				window.location = '/';
			}
		});
	});
})();