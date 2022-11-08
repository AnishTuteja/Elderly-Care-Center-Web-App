const Review = require('../models/review');
const Care_center = require('../models/care_center');

module.exports.create_review = async (req, res) => {
    const new_review = new Review(req.body);
    new_review.owner = req.user._id;
    await new_review.save();
    const { id } = req.params;
    const care_center = await Care_center.findById(id);
    care_center.reviews.push(new_review);
    await care_center.save();
    req.flash('success', 'Thanks for your feedback!!')
    res.redirect(`/care_center/${id}`);
}

module.exports.delete_review = async (req, res) => {
    const { id, r_id } = req.params;
    await Care_center.findByIdAndUpdate(id, { $pull: { reviews: r_id } });
    await Review.findByIdAndDelete(r_id);
    req.flash('success', 'Successfully deleted your review!');
    res.redirect(`/care_center/${id}`);
};
