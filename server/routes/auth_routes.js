const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authRouter = require('express').Router();
const session = require('express-session');
const e = require('express');
// const passport = require('../config/passport_setup.js');
authRouter.use(session({
    secret: 'anything',
    resave: true,
    saveUninitialized: true
}));
const db = ('../db/db.js');
authRouter.use(passport.initialize());
authRouter.use(passport.session());

// passport.use(
//     'local', // 'local' is the name of the strategy
//     new LocalStrategy((email, password, done) => {
//         console.log('LocalStrategy');
//         db('users')
//             .where({ email })
//             .first()
//             .then(user => {
//                 console.log('User found');
//                 if (!user) {
//                     console.log('Incorrect email');
//                     return done(null, false, { message: 'Incorrect email.' });
//                 }
//                 if (password !== user.password) {
//                     console.log('Incorrect password');
//                     return done(null, false, { message: 'Incorrect password.' });
//                 }
//                 console.log('Authentication successful');
//                 return done(null, user);
//             })
//             .catch(err => {
//                 console.log('Error:', err);
//                 done(err);
//             });
//     })
// );

passport.use( 'local-login', new LocalStrategy.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
     (req, email, password, done) => {
        console.log('LocalStrategy');
        done(null);
        // try {
        //     const user = userController.getUserByEmail('email', email);
        //     if (!user) {
        //         return done(null, false, { message: "Incorrect email." });
        //     }
        //     if (!bcrypt.compare(password, user.password)) {
        //         return done(null, false, { message: "Incorrect password." });
        //     }
        //     return done(null, user);
        // } catch (error) {
        //     done(error);
        // }
    }
));

passport.serializeUser((user, done) => {
    console.log('serializeUser');
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log('deserializeUser');
    db('users')
        .where({ id })
        .first()
        .then(user => done(null, user))
        .catch(err => done(err, null));
});

authRouter.get('/login', (req, res) => {
    console.log('GET /login');
    res.render('login.hbs');
});

authRouter.get('/failure', (req, res) => {
    console.log('GET /failure');
    res.render('failure.hbs', { message: 'Login failed' });
});

authRouter.get('/success', (req, res) => {
    console.log('GET /success');
    res.render('success.hbs', { message: 'Login successful' });
    
});

authRouter.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
        if (err) {
            return res.status(500).json(err);
        }
        if (!user) {
            return res.status(401).json(info.message);
        }
        res.json(user);
    })(req, res, next);
});

module.exports = authRouter;