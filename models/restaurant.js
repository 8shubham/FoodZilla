var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Restaurant Schema
var RestaurantSchema = mongoose.Schema({
	name : {
		type : String
	}, 
	owner : {
		type : String
	},
	email : {
		type : String,
		unique : true
	},
	password : {
		type : String
	},
	city : {
		type : String,
		lowercase : true
	},
	description : {
		type : String
	},
	status : {
		type : Boolean,
		default : false
	},
	stars : {
		type : Number
	}
});

var Restaurant = module.exports = mongoose.model('Restaurant', RestaurantSchema);

module.exports.createRestaurant = function(newRestaurant, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newRestaurant.password, salt, function(err, hash) {
	        newRestaurant.password = hash;
	        newRestaurant.save(callback);
	    });
	});
}

module.exports.getRestaurantByEmail = function(email, callback){
	var query = {email: email};
	Restaurant.find(query, callback);
}

module.exports.getRestaurantByCity = function(city, callback){
	var query = {city : city};
	Restaurant.find(query, callback);
}

// module.exports.getRestaurantByStatus = function(callback){
// 	var query = {status : false};
// 	Restaurant.find(query, callback);
// }

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}


module.exports.getRestaurantByStatus=function(status,callback){
 
        var query={status:status};
	Restaurant.find(query,callback);
}


module.exports.UpdateStatus=function(email,status,callback){
	
	console.log(status);
	console.log(email);

	var query={email:email};
	 var newstatus = { $set: { status: status } };
	Restaurant.findOneAndUpdate(query,newstatus,{upsert:true},callback);
	

}

module.exports.deleteRestaurantByStatus=function(email,callback){
	
	
	console.log(email);

	 var query={email:email};
	 
	Restaurant.findOneAndRemove(query,callback);
	

}

module.exports.deleteRestaurant=function(email,callback){

	var query={email:email};

	Restaurant.findOneAndRemove(query,callback);

}
