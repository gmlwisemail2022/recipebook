const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const dotenv = require('dotenv');
dotenv.config({ path: "../.env"});

// passport.use() is a function that takes a new instance of a strategy as its first argument
passport.use(
  new GoogleStrategy({
    // options for the GoogleStrategy
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true
    }, 
    (request, accessToken, refreshToken, profile, done) => {
        // passport callback function
        // check if user already exists in our db
        
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