(function() {
	//用户注册逻辑
	$('#register-apply').click(function() {
		var username = $('#register-username input').val();
		var password = $('#register-password input').val();
		var re_password = $('#register-password-repeat input').val();
		var user = {
			username: username,
			password: password
		};
		var socket = io.connect('localhost:3000');
		//信息完整性判断
		if (username === '') {
			alert('用户名不能为空');
			return;
		}

		if (password === '') {
			alert('密码不能为空');
			return;
		}

		if (password !== re_password) {
			alert('两次输入密码不一致');
			return;
		}

		socket.emit('register', user);

		console.log(user);

		socket.on('register success', function() {
			alert('注册成功');
			window.location = '/chat';
		});

		socket.on('register failed', function() {
			alert('注册失败');
			window.location = '/register';
		});
	});
})();