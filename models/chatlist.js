function Chatlist() {
}
Chatlist.prototype = {
	namelist : [],
	size : 0,
	isHave : function(usrname) {
			return this.namelist.some(function(item, index, array) {
			return (item === usrname);
		});
	},
	/* add user name into namelist
	* return true if insert sucessfully
	* else return false;
	*/
	add : function(usrname) {
		if (this.isHave(usrname)) {
			return false;
		}
		this.namelist.push(usrname);
		this.size++;
		return true;
	},

	// return removed array of namelist
	remove : function(usrname) {
		this.namelist = this.namelist.filter(function(item, index, array) {
			return (item != usrname);
		});
		return this.namelist;
	}
};

module.exports = Chatlist;