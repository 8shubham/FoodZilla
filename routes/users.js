var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Restaurant = require('../models/restaurant');
const notifier = require('node-notifier');
var nodemailer = require('nodemailer');


// // Register
// router.get('/register', function(req, res){
// 	res.render('register');
// });

// Login
router.get('/login', function(req, res){
	res.render('index');
});

//Register
router.get('register', function(req, res){
	res.render('index');
});

// Register User
router.post('/register', function(req, res){
	var fname = req.body.fname;
	var lname = req.body.lname;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	// req.checkBody('fname', 'First name is required').notEmpty();
	// req.checkBody('lname', 'Last name is required')
	// req.checkBody('email', 'Email is required').notEmpty();
	// req.checkBody('email', 'Email is not valid').isEmail();
	// req.checkBody('password', 'Password is required').notEmpty();
	// req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	// var errors = req.validationErrors();

	if(password != password2){
		req.flash('error_msg', 'Registration Failed : Passwords were not matching');
		res.redirect('/');
		//console.log(errors);
	} else {
		//User already registered
		// User.getUserByEmail(email, function(err, user){
		// 	if(err) throw err;

		// 	if(user){
		// 		req.flash('error_msg', 'The Email Id is already registered');
		// 		res.redirect('/');
		// 	}
		// });

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
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/');
	}
});

passport.use(new LocalStrategy({
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
   			console.log("YES");
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/',failureFlash: true}),
  function(req, res) {
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

// Update Profile
router.post('/updateProfile', function(req, res){
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
			console.log(user);
		});
		console.log("Registered Restaurant");

		console.log("pending Restaurant");
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
		    console.log(error);
		  } else {
		    console.log('Email sent: ' + info.response);
		  }
		});
	//

		req.flash('success_msg', 'Your restaurant is now registered !!');
//notifier
		notifier.notify({
		  'title': 'My notification',
  		  'message': 'Your Request is pending!'
                });

		res.render('dashboard', {layout: false});
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
		console.log(result.length);
	
		res.render('admin',{layout:false,result:result,flag:true
		});

       });

});

router.get('/viewAllRestaurant',function(req,res){

	Restaurant.getRestaurantByStatus(true,function(err,result){
	
		if(err)
			throw err;
		console.log(result.length);
	
		res.render('admin',{layout:false,result:result,flag:false
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
					console.log(result.length);

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
					    console.log(error);
					  } else {
					    console.log('Email sent: ' + info.response);
					  }
					});
				//
					console.log("email for delete");



				res.render('admin',{layout:false,result:result,flag:false
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
	console.log(status);
	console.log(email);

	if(status=='Accept'){

		Restaurant.UpdateStatus(email,true,function(err,data){

			if(err)
				throw err;

	
			Restaurant.getRestaurantByStatus(false,function(err,result){

				if(err)
					throw err;
				console.log(result.length);
				
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
				    console.log(error);
				  } else {
				    console.log('Email sent: ' + info.response);
				  }
				});
			//
				console.log("email for accept");

				res.render('admin',{layout:false,result:result,flag:true,flag2:false
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
				console.log(result.length);


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
				    console.log(error);
				  } else {
				    console.log('Email sent: ' + info.response);
				  }
				});
			//
				console.log("email for reject");


				res.render('admin',{layout:false,result:result,flag:true,flag2:false
				});

		       });
			//res.redirect('/users/admin');
		});		

	}

});			
		

// Display All Registered Customers To Admin
router.get('/viewAllCustomers',function(req,res){

	User.getAllUsers(function(err,data){
	
		console.log("heyyyy");
		console.log(data.length);
		if(err)
			throw err;
		console.log("heyyyy");
		console.log(data.length);
	
		res.render('admin',{layout:false,result:data,flag2:true,flag:false
		});

       });

});

module.exports = router;