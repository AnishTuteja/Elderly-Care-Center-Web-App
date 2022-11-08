const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync');
const { validate_review, is_loggedin, is_review_owner } = require('../middleware');
const reviews = require('../controllers/reviews');

//create a new review for a particular care center
router.post('/', is_loggedin, validate_review, catchAsync(reviews.create_review));

//delete a review
router.delete('/:r_id', is_loggedin, is_review_owner, catchAsync(reviews.delete_review));

module.exports = router;