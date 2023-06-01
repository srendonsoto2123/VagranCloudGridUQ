const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');

const {
  googleClientId,
  googleClientSecret,
} = require('../settings');

passport.use('auth-google', new GoogleStrategy({
  clientID: googleClientId,
  clientSecret: googleClientSecret,
  callbackURL: 'http://localhost:3000/api/v1/auth/google',
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));
