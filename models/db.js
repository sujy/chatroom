var connection;

//连接数据库
exports.getConnection = function(callback) {
	if (connection) {
		callback(connection);
	} else {
		var MongoClient = require('mongodb').MongoClient;
		var settings = require('../settings');
		var url = 'mongodb://' + settings.host + ':' + settings.port + '/' + settings.name;
		MongoClient.connect(url, function(err, db) {
			if (err) {
				throw new Error('数据库连接失败');
			}
			callback(db);
		});
	}
};

//清空数据库
exports.clear = function(callback) {
	exports.getConnection(function(db) {
		db.dropDatabase(function(err, result) {
			if (err) {
				throw new Error('Database connection failed.');
			}

			if (callback) {
				console.log('数据库已清空');
				callback();
			}
		});
	});
};

//初始化数据库
exports.initialize = function(callback) {
	exports.getConnection(function(db) {
		var user = db.collection('user');
		user.insert({
			username: 'admin',
			password: 'admin',
		}, function(err) {
			if (err) {
				throw new Error('向users插入数据失败');
			}

			if (callback) {
				console.log('插入初始数据成功');
				console.log('插入user集合成功');
				callback();
			}
		});
	});
};