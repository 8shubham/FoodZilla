var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var adminSchema = mongoose.Schema({
	
	password: {
		type: String
	},

	email: {
		type: String,
		unique: true
	},
	
	type: {
	 		type: String,
	 		default:"type3"
	 }

});

var Admin = module.exports = mongoose.model('Admin', adminSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getAdminByEmail = function(email, callback){
	var query = {email: email};
	console.log(email);
	Admin.findOne(query, callback);
}


module.exports.getAdminById = function(id, callback){
	Admin.findById(id, callback);
}

module.exports.getById = function(id, callback){
	Admin.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
