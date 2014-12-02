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
		//按下Enter
		$('#login-form').keydown(function(e) {
			if (e.keyCode === 13) {
				$('#btn-login').click();
			}
		});
		//login
		$('#btn-login').on('click', function() {
			var _username = $('#login-user input').val();
			var _password = $('#login-password input').val();
			//login data
			_data = {
				username: _username,
				password: _password
			};
			//package message
			var message = packageMessage('login', _source, _destination, _cookie, _data);
			//emit
			socket.emit('message', message);
		});

		socket.on('response', function(response) {
			console.log(response);
			if (response.statusCode == 204) {
				alert(response.data);
				$('#login-user input').val('');
				$('#login-password input').val('');
			}
			if (response.statusCode == 200) {
				alert(response.data);
				window.location = '/chat';
			}
		});
	});
})();