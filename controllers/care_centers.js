const { urlencoded } = require('express');
const Care_center = require('../models/care_center');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const map_box_token = process.env.MAPBOX_TOKEN;
const states = require('../public/javascripts/states')
const geocoder = mbxGeocoding({ accessToken: map_box_token });


module.exports.search_result = async (req, res) => {
    const state = req.body.state;
    const care_centers = await Care_center.find({ "location": { $regex: state } });
    res.render('care_center/index', { care_centers, states });
}

module.exports.index = async (req, res) => {
    const care_centers = await Care_center.find({});
    res.render('care_center/index', { care_centers, states });
};

module.exports.render_new_form = (req, res) => {
    res.render('care_center/new', { states });
};

module.exports.create_care_center = async (req, res, next) => {
    req.body.location = req.body.location.concat(", ", req.body.state);
    const geodata = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();
    const new_care_center = new Care_center(req.body);
    new_care_center.geometry = geodata.body.features[0].geometry;
    new_care_center.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    new_care_center.owner = req.user._id;
    await new_care_center.save();
    req.flash('success', 'Successfully made a new care center!');
    res.redirect(`/care_center/${new_care_center._id}`);
};

module.exports.show_care_center = async (req, res) => {
    const care_center = await Care_center.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'owner'
        }
    }).populate('owner');
    if (!care_center) {
        req.flash('error', 'The requested care center doesn\'t exist');
        res.redirect('/care_center')
    } else {
        res.render('care_center/show', { care_center });
    }
};

module.exports.render_edit_form = async (req, res) => {
    const { id } = req.params;
    const care_center = await Care_center.findById(id);
    if (!care_center) {
        req.flash('error', 'The requested care center doesn\'t exist');
        return res.redirect('/care_center');
    }
    res.render('care_center/edit', { care_center });
};

module.exports.update_care_center = async (req, res) => {
    const { id } = req.params;
    const care_center = await Care_center.findByIdAndUpdate(id, req.body, { runValidators: true });
    care_center.images.push(...req.files.map(f => ({ url: f.path, filename: f.filename })));
    care_center.save();
    req.flash('success', 'Successfully updated the care center');
    res.redirect(`/care_center/${id}`);
};

module.exports.delete_care_center = async (req, res) => {
    const { id } = req.params;
    await Care_center.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted your care center!');
    res.redirect('/care_center');
};