const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const dotenv = require('dotenv');
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
    async (request, accessToken, refreshToken, profile, done) => {
        console.log('passport callback function fired');
        
        done(null, profile);
    }));

// passport.serializeUser() 
passport.serializeUser((user, done) => {
    done(null, user);
});

// passport.deserializeUser() 
passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;