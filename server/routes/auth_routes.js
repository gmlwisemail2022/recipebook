const passport = require('passport');

const router = require('express').Router();
const session = require('express-session');
router.use(session({ secret: 'anything' }));
router.use(passport.initialize());
router.use(passport.session());


require('../config/passport_setup.js');

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
}


// auth login
router.get('/login', (req, res) => {
    res.render('login.hbs');
});

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    res.send('logging out');
});

// auth with google
router.get('/google', (req, res) => {
    passport.authenticate('google', {
        scope: ['email']
    });
});

// callback route for google to redirect to
router.get('/google/callback', (req, res) => {
    passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/failure'
    });
});

router.get('/failure', (req, res) => {
    res.send('Failed to log in');
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.send('You are logged in');
});

module.exports = router;