const passport = require('passport');
const router = require('express').Router();
const session = require('express-session');
router.use(session({
    secret: 'anything',
    resave: true,
    saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());



require('../config/passport_setup.js');

// function isLoggedIn(req, res, next) {
//     req.user ? next() : res.render('failure.hbs');
// }

// function notLoggedIn(req, res, next) {
//     req.user ? res.render('failure.hbs') : next();
// }

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    res.send('logging out');
});

// auth with google
router.get('/google',
    passport.authenticate('google', {
        scope: ['email', 'profile']
    })
);

// callback route for google to redirect to
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/failure'
})
);

// auth with local
router.post('/login', (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            return res.status(200).json(user);
        });
    })(req, res, next);
});
// router.post('/login', passport.authenticate('local-login', {
//     successRedirect: '/',
//     failureRedirect: '/auth/failure'
// }));

router.get('/login', (req, res) => {
    res.render('login.hbs');
});

router.get('/failure', (req, res) => {
    res.render('failure.hbs');
});

// router.get('/protected', isLoggedIn, (req, res) => {
//     res.send('you are logged in, this is your profile - ' + req.user.displayName);
// });

router.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.send('you are logged out');
});

module.exports = router;