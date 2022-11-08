const express = require('express');
const catchAsync = require('../utilities/catchAsync');
const router = express.Router();
const User = require('../models/user');
const ExpressError = require('../utilities/ExpressError');
const passport = require('passport');
const users = require('../controllers/users');

router.route('/login')
    .get(users.render_login)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.login)

router.route('/signup')
    .get(users.render_signup_form)
    .post(catchAsync(users.signup));

router.get('/logout', users.logout);

module.exports = router;
