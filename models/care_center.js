const { string } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const { Schema } = mongoose;



const Care_center_schema = new Schema({
    title: String,
    price: Number,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, { toJSON: { virtuals: true } });

Care_center_schema.virtual('properties.popup_markup').get(function () {
    return `<strong><a class="link-primary" style="font-size: 18px" href="/care_center/${this._id}">${this.title}</a></strong><p>${this.description.substring(0, 100)}..</p>`;
});

Care_center_schema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Care_center', Care_center_schema);