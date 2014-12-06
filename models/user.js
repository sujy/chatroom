var mongodb = require('./DB');
var encryp = require('./crypto');

// construct user(json)
function User(user) {
	this.username = user.username;
	this.password = encryp(user.password);
	console.log('username:' + this.username + '--' + this.password);
}

//export
module.exports = User;
//insert the user to the DB
User.prototype.save = function(callback) {
	var user = {
		username: this.username,
		password: this.password
	};
	mongodb.open(function(err, db) {
		if(err) callback(err);
		db.collection('user', function(err, col) {
			if (err) {
				callback(err);
			}
			//insert user to db
			col.insert(user, {
				safe: true
			}, function(err, user) {
				if (err) {
					db.close();
					callback(err);
				}
				db.close();
				callback(null, user); //return user insert
			});
		});
	});

};
User.get = function(username, callback) {
	mongodb.open(function(err, db) {
		if (err) callback(err);
		//read user
		db.collection('user', function(err, collection) {
			//find username 
			collection.findOne({
				username: username
			}, function(err, info) {
				db.close();
				if (err) callback(err);
				else callback(err, info);
			});
		});
	});

};