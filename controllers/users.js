const User = require('../models/user');

module.exports.render_login = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', `Welcome back ${req.body.username}!`);
    const redirect_url = req.session.return_to || '/care_center';
    delete req.session.return_to;
    res.redirect(redirect_url);
};


module.exports.render_signup_form = (req, res) => {
    res.render('users/signup');
};

module.exports.render_signup_form = (req, res) => {
    res.render('users/signup');
};

module.exports.signup = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const new_user = new User({ email, username });
        await User.register(new_user, password);
        req.login(new_user, function (err) {
            if (err) {
                next(err);
            } else {
                req.flash('success', `Welcome to Elderly Care Foundation ${new_user.username}!  You are now a registered member`);
                res.redirect('/care_center');
            }
        })
    } catch (err) {
        next(new ExpressError(err.message, 400));
    }
};

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            next(err);
        } else {
            req.flash('success', 'Successfully logged out!');
            res.redirect('/care_center');
        }
    });
};

