const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport.use() is a function that takes a new instance of a strategy as its first argument
passport.use(
  new GoogleStrategy({
    // options for the GoogleStrategy
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/redirect',
    passReqToCallback: true
    }, 
    (request, accessToken, refreshToken, profile, done) => {
        // passport callback function
        // check if user already exists in our db
        console.log('passport callback function fired');
        console.log(profile);
        done(null, profile);
    }));