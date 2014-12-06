var crypto = require('crypto');

function getEncryp(key){
	var hash = crypto.createHash('sha1');
	return hash.update(key).digest('hex');
}
//export
module.exports = getEncryp;