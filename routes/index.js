const express = require('express');
const router = express.Router();
const passport = require('passport');
const { User } = require('../models'); 
const seedDatabase = require('../seeders/seeders');

// Middleware to pass common data to all templates, including flash messages
router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.errorMessages = req.flash('error');
  res.locals.successMessages = req.flash('success');
  next();
});

// Display the home page
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

// Display the login page
router.get('/login', function(req, res) {
  res.render('login', { title: 'Login' });
});

// Display the sign-up page
router.get('/signup', function(req, res) {
  res.render('signup', { title: 'Sign Up' });
});

// Handle sign-up
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      req.flash('error', 'Username is already taken.');
      return res.redirect('/signup');
    }

    await User.create({ username, password, role: 'member' });
    req.flash('success', 'Account created successfully. Please log in.');
    res.redirect('/login');
  } catch (error) {
    console.error('Signup error:', error);
    req.flash('error', 'Error creating user.');
    res.redirect('/signup');
  }
});

// Handle login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// Logout route
router.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
  });
  req.flash('success', 'You have been logged out.');
  res.redirect('/');
});

// Route to populate the database
router.post('/populate', async (req, res) => {
  try {
    await seedDatabase(); 
    req.flash('success', 'Database populated successfully.');
    res.redirect('/');
  } catch (error) {
    console.error('Error populating database:', error);
    req.flash('error', 'Error populating database.');
    res.redirect('/');
  }
});

module.exports = router;
