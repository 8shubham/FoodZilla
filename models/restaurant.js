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
	},
	phoneNumber: {
		type : String
	},
	address :{
		type : String
	},
	openingHours :{
		type : String
	},
	averageCost :{
		type : Number
	},
	
	imageurl: {
		type: String
	},

	type: {
	 		type: String,
	 		default:"type2"
	 },

	menu:[
	 		{
				path: {
			 		type: String,
			 		trim: true
				 },
	
				 originalname: {
						 type: String
				// 		 required: true
				 },	 			
	 		}
	 ],

	 photo:[
	 		{
				path: {
			 		type: String,
			 		trim: true
				 },
	
				 originalname: {
						 type: String
				// 		 required: true
				 },	 			
	 		}
	 ],

	 Item:[
	 		{
				itemName: {
			 		type: String,
			 		trim: true
				 },
	
				 price: {
						 type: String
				// 		 required: true
				 },

				 		
	 		}
	 ]

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


module.exports.getRestaurantById = function(id, callback){
	Restaurant.findById(id, callback);
}

module.exports.getById = function(id, callback){
	Restaurant.findById(id, callback);
}

module.exports.getRestaurantByEmail = function(email, callback){
	console.log("hello skashi");
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


module.exports.getRestaurantByEmail = function(email, callback){
	console.log(email);
	//alert(email);
	var query = {email: email};
	Restaurant.findOne(query, callback);
}

// module.exports.getRestaurantById = function(id, callback){
// 	Restaurant.findById(id, callback);
// }

module.exports.updateRestaurant = function(email,phone,address,openingHours,averageCost,callback){
	
	var query={email:email};
	 var newvalues = { $set: { address:address,phoneNumber :phone,openingHours:openingHours ,averageCost:averageCost}};
	Restaurant.findOneAndUpdate(query,newvalues,{upsert:true},callback);
}

module.exports.updateMenu = function(email,path,originalname,callback){
	
	var query={email:email};

	var newMenu= { path:path, originalname:originalname };

	Restaurant.update(
    	query, 
    	{ $push: { menu: newMenu } },
    	callback
	);

}

module.exports.updatePhoto = function(email,path,originalname,callback){
	
	var query={email:email};

	var newPhoto= { path:path, originalname:originalname };

	Restaurant.update(
    	query, 
    	{ $push: { photo: newPhoto } },
    	callback
	);

	

}

module.exports.updateImageUrl = function(email,path,callback){
	
	var query={email:email};

	var newPath = { $set: { imageurl: path } };

	//Restaurant.update(query,newPath,{upsert:true},callback);
	Restaurant.findOneAndUpdate(query,newPath,{upsert:true},callback);

}

module.exports.updateItem = function(email,itemName,price,callback){
	console.log("heyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
	var query={email:email};

	var remail=email;

	var newItem= { itemName:itemName, price:price, remail:remail };
	console.log(newItem);

	Restaurant.update(
    	query, 
    	{ $push: { Item: newItem } },
    	callback
	);

}




