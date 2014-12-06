(function() {
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
				window.location = '/chat?'+$('#register-username input').val();
			}
		});
	});

	function clear() {
		$('#register-password input').val('');
		$('#register-password-confirm input').val('');
	}
})();