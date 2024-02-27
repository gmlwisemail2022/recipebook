const passport = require('passport');
const router = require('express').Router();
const session = require('express-session');
router.use(session({
    secret: 'anything'
    , resave: true, saveUninitialized: true
}));
const dotenv = require('dotenv');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const db = require('../db/db.js');
const userController = require("../controller/users.js");
dotenv.config({ path: '../.env' });

// passport.use() is a function that takes a new instance of a strategy as its first argument
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

// passport.serializeUser() 
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// passport.deserializeUser() 
passport.deserializeUser(async (id, done) => {
    const user = await knex('users').where({ id: id });
    return user ? done(null, user) : done(null, false);
});


passport.use( 'local-login', new LocalStrategy.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false
},
    async (email, password, done) => {
        try {
            const user = await userController.getUserByEmail('email', email);
            if (!user) {
                return done(null, false, { message: "Incorrect email." });
            }
            if (!bcrypt.compare(password, user.password)) {
                return done(null, false, { message: "Incorrect password." });
            }
            return done(null, user);
        } catch (error) {
            done(error);
        }
    }
));

passport.use(
    "local-login",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            // passReqToCallback: true,
        },
        async (email, password, done) => {
            try {
                const user = await db("users").where({ email: email }).first();
                if (!user) {
                    return done(null, false, { message: "Incorrect email." });
                }
                if (!bcrypt.compare(password, user.password)) {
                    return done(null, false, { message: "Incorrect password." });
                }
                return done(null, user);
            } catch (error) {
                return res.status(302).json({redirect: '/'});
            }
        }
    ));

router.use(passport.initialize());
router.use(passport.session());

module.exports = passport;