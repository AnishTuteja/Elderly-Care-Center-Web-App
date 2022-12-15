const express = require('express');
const router = express.Router();
const Care_center = require('../models/care_center');
const catchAsync = require('../utilities/catchAsync');
const care_centers = require('../controllers/care_centers');
const { is_loggedin, validate_care_center, is_owner } = require('../middleware');
const care_center = require('../models/care_center');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(care_centers.index))
    .post(is_loggedin, upload.array('image'), validate_care_center, catchAsync(care_centers.create_care_center));

router.get('/new', is_loggedin, care_centers.render_new_form);
router.post('/search', care_centers.search_result);

router.route('/:id')
    .get(catchAsync(care_centers.show_care_center))
    .put(is_loggedin, is_owner, upload.array('image'), validate_care_center, catchAsync(care_centers.update_care_center))
    .delete(is_loggedin, is_owner, catchAsync(care_centers.delete_care_center));

router.get('/:id/edit', is_loggedin, is_owner, catchAsync(care_centers.render_edit_form));

module.exports = router;
