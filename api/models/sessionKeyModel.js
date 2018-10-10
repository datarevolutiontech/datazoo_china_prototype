// Applicant Model file
const mongoose = require('mongoose');
require('dotenv').config();

const sessionKeySchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    username: {
        type: String,
        required: true
    },
    sessionKey: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('SessionKeys', sessionKeySchema);
