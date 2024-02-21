const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

passport.use(
    new GoogleStrategy({
    // options for the google strategy
    callbackURL: '/auth/google/redirect',
    clientID: 'your google client id',
    clientSecret: 'your google client secret'
}, (accessToken, refreshToken, profile, done) => {
    // passport callback function
    console.log('passport callback function fired');
    console.log(profile);
    // done(null, profile);
}))