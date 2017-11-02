var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	password: {
		type: String
	},
	email: {
		type: String,
		unique: true
	},
	fname: {
		type: String
	},

	lname: {
		type: String
	},

	path: {
	 		type: String,
	 //		required: true,
	 		trim: true
	 },
	
	 originalname: {
			 type: String
	// 		 required: true
	 },

	 wallet: {
	 	type : Number,
	 	default:0
	 },

	 type: {
	 		type: String,
	 		default:"type1"
	 }

});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByEmail = function(email, callback){
	var query = {email: email};
	console.log("useremail "+email);
	
	User.findOne(query, callback);
}


module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.getById = function(id, callback){
	User.findById(id, callback);
}

module.exports.getUserByName = function(name, callback){
	var query = {name : name};
	User.find(name, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

// fetch all customer details to display to admin
module.exports.getAllUsers = function(callback){
	User.find(callback);
}


module.exports.UploadProfile=function(email,path,imageName,callback){
	
	console.log(path);
	console.log(imageName);

	 var query={email:email};
	 var newstatus = { $set: { path: path, originalname: imageName} };
	
	 User.findOneAndUpdate(query,newstatus,{upsert:true},callback);
	

}

module.exports.AddMoney=function(email,wallet,money,callback){
	
	console.log("wallet "+wallet);
	console.log("money "+money);
	wallet=wallet+money;

	 var query={email:email};
	 var newstatus = { $set: { wallet: wallet} };
	
	 User.findOneAndUpdate(query,newstatus,{upsert:true},callback);
		

}

module.exports.updateWallet=function(email,wallet,money,callback){
	
	console.log("wallet "+wallet);
	console.log("money "+money);
	wallet=wallet-money;

	 var query={email:email};
	 var newstatus = { $set: { wallet: wallet} };
	
	 User.findOneAndUpdate(query,newstatus,{upsert:true},callback);
		

}

module.exports.getOrders=function(email,callback){



}
