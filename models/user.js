const mongoose = require('mongoose');
const { Schema } = mongoose;
const passport_local_mongoose = require('passport-local-mongoose');

const User_schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

User_schema.plugin(passport_local_mongoose);

module.exports = mongoose.model('User', User_schema);