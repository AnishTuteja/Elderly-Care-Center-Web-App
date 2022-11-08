const { Care_center_schema, Review_schema } = require('./schemas');
const ExpressError = require('./utilities/ExpressError');
const Care_center = require('./models/care_center');
const Review = require('./models/review');

module.exports.is_loggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.return_to = req.originalUrl;
        req.flash('error', 'You must be signed in for this for this action.');
        res.redirect('/login');
    } else {
        next();
    }
}
module.exports.validate_care_center = function (req, res, next) {
    const { error } = Care_center_schema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.is_owner = async (req, res, next) => {
    const { id } = req.params;
    const care_center = await Care_center.findById(id);
    if (!care_center.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that!');
        res.redirect(`/care_center/${id}`);
    } else {
        next();
    }
}

module.exports.validate_review = function (req, res, next) {
    const { error } = Review_schema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.is_review_owner = async (req, res, next) => {
    const { id, r_id } = req.params;
    const review = await Review.findById(r_id);
    if (!review.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that!');
        res.redirect(`/care_center/${id}`);
    } else {
        next();
    }
}


