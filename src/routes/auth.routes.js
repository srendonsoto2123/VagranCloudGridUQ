const router = require('express').Router();
const passport = require('passport');

require('../middlewares/google');
const {
  signUp,
  signIn,
} = require('../middlewares/auth');

router.route('/google').get(passport.authenticate('auth-google', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],
  session: false,
}), (req, res) => res.send(req.user));

router.route('/signup')
  .post(signUp);

router.route('/signin')
  .post(signIn);

module.exports = router;
