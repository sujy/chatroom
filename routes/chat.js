var express = require('express');
var router = express.Router();

//聊天页面
router.get('/', function(req, res) {	
	res.render('chat', {
		title: '大厅'
	});
});

module.exports = router;