const passport = require('passport');
const router = require('express').Router();
const session = require('express-session');
router.use(session({ secret: 'anything' }));
router.use(passport.initialize());
router.use(passport.session());
const dotenv = require('dotenv');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const knex = require('knex');
dotenv.config({path: '../.env'});

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
        const user = await knex('users').where({googleId: profile.id});
        if (profile) {
            return done(null, user);
        }

        
        return done(null, profile);
    })
);

router.use(
    session({
        secret: 'anything',
        resave: false,
        saveUninitialized: false,
    })
);

// passport.serializeUser() 
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// passport.deserializeUser() 
passport.deserializeUser(async (id, done) => {
    const user = await knex('users').where({id: id});
    return user ? done(null, user) : done(null, false);
});

passport.use(
    "local-login",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        async (request, email, password, done) => {
            const user = await knex('users').where({email: email}).first();
            if (user) {
                const result = await bcrypt.compare(password, user.password);
                return result ? done(null, user) : done(null, false);
            } else {
                return done(null, false);
            }
        }
    )
);

module.exports = passport;