const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const dotenv = require('dotenv');
dotenv.config();

// passport.use() is a function that takes a new instance of a strategy as its first argument
passport.use(
  "google", new GoogleStrategy({
    // options for the GoogleStrategy
    clientID: '586647241181-r9rb78539mgdi0kqtt3qqrml4tbjqj16.apps.googleusercontent.com',
    clientSecret: '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',
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