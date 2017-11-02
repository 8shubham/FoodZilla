var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Restaurant = require('../models/restaurant');
var Admin = require('../models/admin');
const notifier = require('node-notifier');
var nodemailer = require('nodemailer');

var math = require('mathjs');
var multer = require('multer');
var Order = require('../models/order');
var parser= require('json-parser');


// Login
//router.get('/login', function(req, res){
//	res.render('index');
//});

//Register
router.get('register', function(req, res){
	res.render('index');
});

router.post('/profile', function(req, res){

	var email=req.body.email;

	Order.getOrderByUser(email,true,function(err,data){

									if(err)
										throw err;
									
									//console.log(data);

									res.render('profile',{result:data});	
	});

	//res.render('profile');

});

// restaurant Login
//Restaurant
router.get('/restaurant',function(req,res){
	//console.log("restaurant redirect");
	res.render('restaurant');
		
}); 

router.get('/foodzilla',function(req,res){

		res.render('foodzilla');
});


// Register User

router.post('/register', function(req, res){

	var fname = req.body.fname;
	var lname = req.body.lname;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	if(password != password2){
		req.flash('error_msg', 'Registration Failed : Passwords were not matching');
		res.redirect('/');
		////console.log(errors);
	} else {
		
		var newUser = new User({
			fname: fname,
			lname: lname,
			email: email,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err){ 
				req.flash('error_msg', 'Registration Failed : Email ID already exisiting');
				res.redirect('/');
			}

		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/');
	}
});

// Register User

router.post('/adminregister', function(req, res){

	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	if(password != password2){
		req.flash('error_msg', 'Registration Failed : Passwords were not matching');
		res.redirect('/');
		////console.log(errors);
	} else {
		
		var newUser = new Admin({
		
			email: email,
			password: password
		});

		Admin.createUser(newUser, function(err, user){
			if(err){ 
				req.flash('error_msg', 'Registration Failed : Email ID already exisiting');
				res.redirect('/');
			}


		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/');
	}
});


passport.use('user',new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
  },
  function(username, password, done) {
  	
   User.getUserByEmail(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			// // ("YES");
   			// // (restaurant);
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
}));



passport.use('restaurant',new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
  },
  function(username, password, done) {
  	
   Restaurant.getRestaurantByEmail(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown Restaurant'});
   	}

   	Restaurant.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			// // ("YES");
   			// // (restaurant);
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
}));


passport.use('admin',new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
  },
  
  function(username, password, done) {
  	
   Admin.getAdminByEmail(username, function(err, user){
   
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'You are not admin'});
   	}

   	Admin.comparePassword(password, user.password, function(err, isMatch){
   		
   		if(err) throw err;
   		
   		if(isMatch){
   			// // ("YES");
   			// // (restaurant);
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });

}));


passport.serializeUser(function(user, done) {

  var key = {
    id: user.id,
    type: user.type
  }

  done(null, key);

});

passport.deserializeUser(function(key, done) {
  // this could be more complex with a switch or if statements
  var Model = key.type === 'type1' ? User : Restaurant;
  if(key.type=='type1')
  		Model=User;
  else if(key.type=='type2')
  		Model=Restaurant;
  else
  		Model=Admin;

  /*Model.findOne({
    _id: key.id
  }, '-salt -password', function(err, user) {
    done(err, user);
  }
*/

  Model.getById(key.id,function(err,user){
  		//	user=data;
  		//	//console.log(user);
  			done(err,user);	
  });

});

/*
passport.serializeUser(function(user, done) {
	//console.log("serialize"+user);	
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  
  User.getUserById(id, function(err, user) {
    //console.log("deserial"+user);

  	if(!user){
  		
  		Restaurant.getRestaurantById(id,function(err,data){
  			user=data;
  			//console.log(user);
  			done(err,user);	
  		});
  	}

    done(err, user);

  });
});
*/

router.post('/restaurantLogin',

  passport.authenticate('restaurant', {successRedirect:'restaurant', failureRedirect:'/',failureFlash: true}),
  function(req, res) {
  	// ("hello sak");
    res.redirect('restaurant');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/');
});


router.post('/adminlogin',

  passport.authenticate('admin', {successRedirect:'admin', failureRedirect:'/',failureFlash: true}),
  function(req, res) {
  	//console.log("admin");
    res.redirect('/');
 });

router.post('/login',
  passport.authenticate('user', {successRedirect:'/', failureRedirect:'/',failureFlash: true}),
  function(req, res) {
  	//console.log("priyanka");
    res.redirect('/');
 });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/');
});

// Dashboard
router.get('/dashboard', function(req, res){
	res.render('dashboard', {layout: false});
});






//Register Restaurant

router.post('/registerRestaurant', function(req, res){
	
	var name = req.body.name;
	var owner = req.body.owner;
	var email = req.body.email;
	var password = req.body.password;
	var description = req.body.description;
	var city = req.body.city;
	var stars = req.body.stars;

	var newRestaurant = new Restaurant({
		name : name,
		owner : owner,
		email : email,
		password : password,
		description : description,
		city : city,
		stars : stars
	});

		Restaurant.createRestaurant(newRestaurant, function(err, user){
		
				if(err) throw err;
				//console.log(user);
		
				//console.log("Registered Restaurant");

				//console.log("pending Restaurant");
				// for email 
				var transporter = nodemailer.createTransport({
				  service: 'gmail',
				  auth: {
				    user: 'foodzillarestaurant@gmail.com',
				    pass: 'foodzilla2017'
				  }
				});

				var mailOptions = {
				  from: 'foodzillarestaurant@gmail.com',
				  to: owner,
				  subject: 'Registered at FoodZilla !!',
				  html: "<h1>Hello</h1><p>Thanks for registering your restaurant  " +name+ " at foodzilla  <br>Your request is 				still pending . You will be notified soon about your request status after verification of the details provided by 	you !! </p> <br> Regards <br> FoodZilla Team  "
				    
				};

				transporter.sendMail(mailOptions, function(error, info){
				  if (error) {
				    //console.log(error);
				  } else {
				    //console.log('Email sent: ' + info.response);
				  }
				});
			//

				req.flash('success_msg', 'Your restaurant is now registered !!');
		//notifier
				notifier.notify({
				  'title': 'My notification',
		  		  'message': 'Your Request is pending!'
		                });

				User.getUserByEmail(owner,function(err,result){
						
						//console.log("user"+result);

						Order.getOrderByUser(email,true,function(err,data){
		                		
		                		res.render('profile',{user:result,result:data});


		                });

				});

		});		
		//res.render('profile');
});

router.get('/viewRestaurant', function(req, res){
	res.render('dashboard', {layout: false});
});

// Search
router.get('/search', function(req, res){
	res.render('search');
});

router.post('/search', function(req, res){

	var city = req.body.city;
	
	Restaurant.getRestaurantByCity(city, function(err, result){
		if(err)	throw err;

		res.render('search', {
			result : result
		});
	});
});

//Admin
router.get('/admin',function(req,res){

     res.render('admin',{layout:false});

});


//reviewRequest

router.get('/reviewRestaurant',function(req,res){

	Restaurant.getRestaurantByStatus(false,function(err,result){
	
		if(err)
			throw err;
		//console.log(result.length);
	
		res.render('admin',{layout:false,result:result,flag:true,flag2:true
		});

       });

});

router.get('/viewAllRestaurant',function(req,res){

	Restaurant.getRestaurantByStatus(true,function(err,result){
	
		if(err)
			throw err;
		//console.log(result.length);
	
		res.render('admin',{layout:false,result:result,flag:false,flag2:true
		});

       });

});




router.post('/deleteRest',function(req,res){

	var email=req.body.email;
	var owner=req.body.owner;
	var name = req.body.name;

	Restaurant.deleteRestaurant(email,function(err,data){

			if(err)
				throw err;

	
				Restaurant.getRestaurantByStatus(true,function(err,result){

					if(err)
						throw err;
					//console.log(result.length);

					// for email 
					var transporter = nodemailer.createTransport({
					  service: 'gmail',
					  auth: {
					    user: 'foodzillarestaurant@gmail.com',
					    pass: 'foodzilla2017'
					  }
					});

					var mailOptions = {
					  from: 'foodzillarestaurant@gmail.com',
					  to: owner,
					  subject: 'Your restaurant site is removed from foodzilla !!',
					  html: "<p>We are very sorry to inform you that your restaurant site "+ name + "is removed from FoodZilla</p> <p>For further details contact our team .</p>"
					    
					};

					transporter.sendMail(mailOptions, function(error, info){
					  if (error) {
					    //console.log(error);
					  } else {
					    //console.log('Email sent: ' + info.response);
					  }
					});
				//
					//console.log("email for delete");



				res.render('admin',{layout:false,result:result,flag:false,flag2:true
				});

		       });
			//res.redirect('/users/admin');
		});		

});


router.post('/reviewRest',function(req,res){

	
	var status=req.body.status;
	var email=req.body.email;
	var owner=req.body.owner;
	var name = req.body.name;
	////console.log(status);
	////console.log(email);

	if(status=='Accept'){

		Restaurant.UpdateStatus(email,true,function(err,data){

			if(err)
				throw err;

	
			Restaurant.getRestaurantByStatus(false,function(err,result){

				if(err)
					throw err;
				//console.log(result.length);
				
					// for email 
				var transporter = nodemailer.createTransport({
				  service: 'gmail',
				  auth: {
				    user: 'foodzillarestaurant@gmail.com',
				    pass: 'foodzilla2017'
				  }
				});

				var mailOptions = {
				  from: 'foodzillarestaurant@gmail.com',
				  to: owner,
				  subject: 'Your request is accepted !!',
				  html: "<h2>Welcome </h2> " + name + " at foodzilla <p>Your request for registration at FoodZilla has been approved . We are happy to have you as a part of our Team . At FoodZilla we care for the rapid growth of  your buisness . You will be notified soon about the terms and conditions  </p> <br> Regards <br> FoodZilla Team  "
				    
				};

				transporter.sendMail(mailOptions, function(error, info){
				  if (error) {
				    //console.log(error);
				  } else {
				    //console.log('Email sent: ' + info.response);
				  }
				});
			//
				//console.log("email for accept");

				res.render('admin',{layout:false,result:result,flag:true,flag2:true
				});

		       });
			//res.redirect('/users/admin');
		});
		
		
		
	}else{

		Restaurant.deleteRestaurantByStatus(email,function(err,data){

			if(err)
				throw err;

	
			Restaurant.getRestaurantByStatus(false,function(err,result){

				if(err)
					throw err;
				//console.log(result.length);


				// for email 
				var transporter = nodemailer.createTransport({
				  service: 'gmail',
				  auth: {
				    user: 'foodzillarestaurant@gmail.com',
				    pass: 'foodzilla2017'
				  }
				});

				var mailOptions = {
				  from: 'foodzillarestaurant@gmail.com',
				  to: owner,
				  subject: 'Your request is rejected !!',
				  html: "<p>We are very sorry to inform you that your request for registration" + name + " at foodzilla is rejected</p> <p>You can contact personally our team .</p>"
				    
				};

				transporter.sendMail(mailOptions, function(error, info){
				  if (error) {
				    //console.log(error);
				  } else {
				    //console.log('Email sent: ' + info.response);
				  }
				});
			//
				//console.log("email for reject");


				res.render('admin',{layout:false,result:result,flag:true,flag2:true
				});

		       });
			//res.redirect('/users/admin');
		});		

	}

});			
		

// Display All Registered Customers To Admin
router.get('/viewAllCustomers',function(req,res){

	User.getAllUsers(function(err,data){
	
		//console.log("heyyyy");
		//console.log(data.length);
		if(err)
			throw err;
		//console.log("heyyyy");
		//console.log(data.length);
	
		res.render('admin',{layout:false,result:data,flag2:true,flag:false
		});

       });

});

// Restaurant supervisor page


// menu images

var storage = multer.diskStorage({
 destination: function(req, file, cb) {
 cb(null, 'public/uploads/')
 },
 filename: function(req, file, cb) {
 cb(null, file.originalname);
 }
});
 
var upload = multer({
 storage: storage
});



//  Profile images

router.get('/profile',function(req,res){

		res.render('profile');
});

router.post('/uploadProfile',upload.any(),function(req,res,next){

		//console.log("photo");

		var email=req.body.email;

		// var path = req.files[0].path;
		 var imageName = req.files[0].originalname;

		 path="/uploads/"+imageName;

		// //console.log(path);
		// //console.log(email);
		// //console.log(imageName);

		 User.UploadProfile(email,path,imageName,function(err,data){

			if(err)
				throw err;

		//	//console.log(data);

			User.getUserByEmail(email,function(err,user){
				
				//console.log(result);
				Order.getOrderByUser(email,true,function(err,data){
		                		
		                		res.render('profile',{user:user,result:data});


		        });

				//res.render('profile',{user:result});
		});


		});

		// console.log("image");
		 
		
});

router.post('/addmoney',function(req,res,next){

		//console.log("money");

		//var cond=math.floor(math.random()*2);
		//console.log(cond);
		var email=req.body.email;

		// var path = req.files[0].path;
		 var wallet = parseInt(req.body.wallet);
		 var money = parseInt(req.body.money);

	//	if(cond==0){

				


	//			 console.log(email);
	//			 console.log(money);
	//			 console.log(wallet);


				 User.AddMoney(email,wallet,money,function(err,data){

					if(err)
						throw err;
	//				console.log(data);
					User.getUserByEmail(email,function(err,user){
				
						notifier.notify({
				 			  'title': 'Your transaction is completed',
		  		  			  'message': money+' added to your wallet'
		                });

		                Order.getOrderByUser(email,true,function(err,data){
		                		
		                		res.render('profile',{user:user,result:data});


		                });

						
				});

				});

	/*	}else{

				User.getUserByEmail(email,function(err,user){
				
						notifier.notify({
				 			  'title': 'Sorry Your transaction failed',
		  		  			  'message': ' Enter correct details and log In again'
		                });

						Order.getOrderByUser(email,true,function(err,data){
		                		
		                		res.render('profile',{user:user,result:data});


		                });
						//res.render('profile',{user:user});
				});
		}
*/

});


 
 

// menu images

var storage = multer.diskStorage({
 destination: function(req, file, cb) {
 cb(null, 'public/uploads/')
 },
 filename: function(req, file, cb) {
 cb(null, file.originalname);
 }
});
 
var upload = multer({
 storage: storage
});

router.post('/menu',upload.any(),function(req, res, next) {
 
		
	//	// ("hello");
		// var path = req.files[0].path;
		 var imageName = req.files[0].originalname;
		 var email=req.body.email;
		 path="/uploads/"+imageName;

	//	 // (path);
	//	 // (imageName);

		 Restaurant.updateMenu(email,path,imageName,function(err,data){
		 		if(err)
		 			throw err;


		 		Restaurant.getRestaurantByEmail(email,function(err,result){

		 			 console.log(result);
		 			 //console.log("sakshi   "+result.menu[0].toObject().path);

		 			res.render('restaurant',{user:result});
		 		});

		 });

});

router.post('/photo',upload.any(),function(req, res, next) {
 
		
	//	// ("photo");
		// var path = req.files[0].path;
		 var imageName = req.files[0].originalname;
		 var email=req.body.email;
		 path="/uploads/"+imageName;

	//	 // (path);
	//	 // (imageName);

		 Restaurant.updatePhoto(email,path,imageName,function(err,data){
		 		if(err)
		 			throw err;

		 		Restaurant.updateImageUrl(email,path,function(err,data1){
		 			if(err)
		 				throw err;

		 			Restaurant.getRestaurantByEmail(email,function(err,result){

	//	 			// (result);

		 			res.render('restaurant',{user:result});
		 		});

		 		});	

		 		

		 });

});



/*
passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
  },
  function(username, password, done) {
  	
   Restaurant.getRestaurantByEmail(username, function(err, restaurant){
   	if(err) throw err;
   	if(!restaurant){
   		return done(null, false, {message: 'Unknown Restaurant'});
   	}

   	Restaurant.comparePassword(password, restaurant.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			// // ("YES");
   			// // (restaurant);
   			return done(null, restaurant);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
}));

passport.serializeUser(function(restaurant, done) {

	owner = 1;
	customer  =0;
  done(null, restaurant.email);
});

passport.deserializeUser(function(email, done) {
	// ("tyuri");
  Restaurant.getRestaurantByEmail(email, function(err, restaurant) {
  	// ("res"+restaurant);
  	//// ("user"+user);
    done(err, restaurant);
  });
});
*/





router.post('/updateRestaurant',function(req,res){
	
	var email=req.body.restaurantEmail;
	var phoneNumber=req.body.phone;
	var address= req.body.address;
	var openingHours=req.body.time1;
	var averageCost=req.body.cost;

	// ("avg"+averageCost);
	// ("avg"+email);
	// ("avg"+phoneNumber);
	// ("avg"+email);
	// ("avg"+openingHours);


	Restaurant.updateRestaurant(email,phoneNumber,address,openingHours,averageCost,function(err,data){
	
		
		if(err)
			throw err;
		 Restaurant.getRestaurantByEmail(email, function(err, result) {
  			
					if(err)
						throw err;
					
			  		res.render('restaurant',{user:result});

			    
			  });


       });

 });

router.post('/addItem',function(req,res){

		var itemName = req.body.itemName;
		var itemPrice = req.body.itemPrice;
		var email = req.body.restaurantEmail;

		Restaurant.updateItem(email,itemName,itemPrice,function(err,data){
		 		if(err)
		 			throw err;


		 		Restaurant.getRestaurantByEmail(email,function(err,result){

		 			// (result);

		 			res.render('restaurant',{user:result});
		 		});

		 });

});



// Restaurant Details To Customer
router.post('/restaurantDetails',function(req,res){
    var email = req.body.restaurantEmail;
    //console.log("Restaurant   "+email);
    Restaurant.getRestaurantByEmail(email,function(err,data){
        if(err)
            throw err;
        res.render('restaurantDetails',{result:data});
    });
    
});

/*

// order food online
router.post('/orderFood',function(req,res){
    var email = req.body.restaurantEmail;
        console.log("Restaurant   "+email);
    Restaurant.getRestaurantByEmail(email,function(err,data){
        if(err)
            throw err;
        console.log(data.email);
        res.render('orderFood',{result:data});
    });

});

// add items to cart 
router.post('/addToCart',function(req,res){
    var email = req.body.resEmail;
    var userEmail = req.body.userEmail;
    var itemName = req.body.itemName;
    var price = req.body.price;
    var noOfItems = req.body.noOfItems;
    console.log("Restaurant   "+email);

    Restaurant.getRestaurantByEmail(email,function(err,data){
        if(err)
            throw err;
    
        console.log("order"+data.email);
    
        res.render('orderFood',{result:data});
    
    });

});
*/

// order foods



// Restaurant Details To Customer
router.post('/restaurantDetails',function(req,res){
    var email = req.body.restaurantEmail;
    //console.log("Restaurant   "+email);
    Restaurant.getRestaurantByEmail(email,function(err,data){
        if(err)
            throw err;
        res.render('restaurantDetails',{result:data});
    });
    
});

router.post('/cart',function(req,res){
		var email=req.body.email;
		console.log("viewCart"+email);

		Order.getOrderByUser(email,false,function(err,data){


				Order.getOrderByUserJson(email,false,function(err,data1){

					//console.log(data1);
					var totalCost=0;

					for(var i=0;i<data1.length;i++){
						//console.log(totalCost+" "+data1[i].totalCost );
						totalCost=(totalCost)+(data1[i].totalCost);
						//totalCost+=data1[0];	
					}
					//console.log(totalCost);
					//console.log(email);

					res.render('cartPage',{userEmail:email,cost:totalCost,result:data});
				});
		});
});

// order food online
router.post('/orderFood',function(req,res){
    var email = req.body.restaurantEmail;
        //console.log("Restaurant   "+email);
    Restaurant.getRestaurantByEmail(email,function(err,data){
        if(err)
            throw err;
        res.render('orderFood',{result:data});
    });

});

router.post('/proceed',function(req,res){
		var email=req.body.email;
		var cost=req.body.cost;

		res.render('deliverylocation',{userEmail:email,cost:cost});

});

router.post('/payment',function(req,res){
		
		var email=req.body.email;
		var cost=req.body.cost;
		//console.log("email "+email);

		User.getUserByEmail(email,function(err,data){
				
				var wallet=data.wallet;
				//console.log("wallet"+wallet);
				//console.log("cost"+cost);

				if((wallet-0)>=(cost-0)){

					//console.log("Paymeny is done");

					notifier.notify({
				 			  'title': 'Payment done successfully',
		  		  			  'message': 'You can view orders'

		                });

					Order.updateStatus(email,true,function(err,data){
							if(err)
								throw err;	

							User.updateWallet(email,wallet,cost,function(err,data1){
									
									Order.getOrderByUser(email,true,function(err,data){


										if(err)
											throw err;
									
										User.getUserByEmail(email,function(err,user){

											////console.log(data);

											res.render('profile',{result:data,user:user});

										});
											
								});
							});
								
						});

						


				}else{
							notifier.notify({
								'title':"not enough money available into your account", 
								'message':"add money to your account first"
							
							});

								Order.getOrderByUser(email,true,function(err,data){

									if(err)
										throw err;

									res.render('profile',{result:data});	
								});

					
				}

						
		});
});

router.post('/addToCart',function(req,res){

	//console.log("add");

    var remail = req.body.resEmail;
    var uemail = req.body.userEmail;
    var itemName = req.body.itemName;
    var price = req.body.price;
    var noOfItems = req.body.noOfItems;
    var newItem= { itemName:itemName, price:price,noOfItems:noOfItems};

    //console.log("price    "+price+"noOfItems"+noOfItems);
    var newOrder = new Order({
        userEmail : uemail,
        restaurantEmail : remail,
        Item : newItem,
        totalCost:parseInt(price)*parseInt(noOfItems)

    });

    //console.log(newOrder);
   // //console.log("remail "+remail);
    ////console.log("uemail "+uemail);
    ////console.log("totalCost "+newOrder.totalCost);


    Order.getOrderByEmails(remail,uemail,false,function(err,data){
        if(err)
            throw err;
        if(!data){
        
        	//console.log("sakshi");

            Order.addOrder(newOrder,function(err,data){
            if(err)
                throw err;
               //console.log(remail);
               
               Restaurant.getRestaurantByEmail(remail,function(err,data){
                if(err)
                    throw err;
               			 res.render('orderFood',{result:data});
                 });
            });

        }
        else
        {
        		//console.log("hellopriyanka");
        	//	//console.log(data.totalCost);
        	//	var TC=parseInt(data.totalCost);
        		//console.log("data "+data);
        		var TC=(data.totalCost);
        		//console.log(TC);
        	//	//console.log(noOfItems);
        		var add=((price-0)*(noOfItems-0));
        		//console.log(add);
        		var tc=(TC) + (add-0);
        		////console.log(tc.type);
        	//	//console.log(tc);

                Order.updateOrder(remail,uemail,newItem,false,function(err,data){
                     if(err)
                         throw err;
                     //console.log("useremail");	
                     Order.updateTotalCost(remail,uemail,tc,false,function(err,data){
                     		if(err)
                     				throw err;

                     		Restaurant.getRestaurantByEmail(remail,function(err,result){

                        		 res.render('orderFood',{result:result});
                     		});
                     });

                     

             });

        }

    });

});

module.exports = router;