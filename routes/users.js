var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Restaurant = require('../models/restaurant');

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
		req.flash('success_msg', 'Your restaurant is now registered !!');

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

// Admin
router.get('/admin', function(req, res){

	// Restaurant.getRestaurantByStatus(function(err, result){
	// 	if(err)	throw err;

	// 	res.render('admin', {layout : false}, {
	// 		result : result
	// 	});
	// });
	res.render('admin', {layout : false});
});

//Accept
router.get('/accept', function(req, res){
	
	res.render('admin', {layout : false});
});

//Reject
router.get('/reject', function(req, res){
	
	res.render('admin', {layout : false});
});

module.exports = router;