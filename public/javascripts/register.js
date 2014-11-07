(function() {
    $('#register-apply').on('click', function() {
    	var username = $('#register-username input').val();
    	var password = $('#register-password input').val();
    	var user = {
    		username: username,
    		password: password
    	};
    	var socket = io.connect('http://127.0.0.1:3000');

    	socket.on('welcome', function() {
		socket.emit('register', user);
		console.log(user);
    	});
    });
})();