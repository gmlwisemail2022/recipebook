const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const authRouter = require('express').Router();
const session = require('express-session');
const knex = require('knex');
// const e = require('express');
// const passport = require('../config/passport_setup.js');
authRouter.use(session({
    secret: 'anything',
    resave: true,
    saveUninitialized: true
}));
const db = ('../db/db.js');

function comparePass(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
}

authRouter.use(passport.initialize());
authRouter.use(passport.session());

// local strategy
passport.use( 'local-login', new LocalStrategy.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
     (req, email, password, done) => {
        console.log('LocalStrategy');
        db('users').where({ email }).first()
        .then(user => {
            if (!user) {
                return done(null, false, { message: 'Incorrect email' });
            }
            if (!authHelpers.comparePass(password, user.password)) {
                return done(null, false, { message: 'Incorrect password' });
            }
            else {
                return done(null, user);
            }
        })
        .catch(err => {
            return done(err);
        });
    }
));

// google strategy
passport.use(
    "google", new GoogleStrategy({
        // options for the GoogleStrategy
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://localhost:3000/auth/google/callback',
        // passReqToCallback: true
    },
        async (accessToken, refreshToken, profile, done) => {
            const user = await knex('users').where({ googleId: profile.id });
            if (profile) {
                return done(null, user);
            }
            return done(null, profile);
        })
);

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

authRouter.get('/google/callback', function(req, res, next) {
    passport.authenticate('google', {
        if (err) {
            return res.status(500).json(err);
        }
    })(req, res, next);
});

module.exports = authRouter;