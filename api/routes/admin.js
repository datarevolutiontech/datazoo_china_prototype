const express   = require('express');
const mongoose = require('mongoose');

const SessionKeys = require('../models/sessionKeyModel');

router = express.Router();

router.post('/sessionToken', (req, res, next) => {

    // unix timestamp for comparison purposes
    let current_timestamp = new Date().getTime();

    // -60 for a safety margin
    milliseconds_in_day = (24 * 60 * 60 * 1000) - 60;
    let oldest_permissible_timestamp = current_timestamp - milliseconds_in_day

    SessionKeys
        .find({ timestamp: { $gt: oldest_permissible_timestamp } }) // get: greater than
        .then(result => {
            // if not found, send an error response
            // if found
            res.status(200).json({
                // sessionKey: key,
                message: "Returning session key"
            })
        })
        .catch(err => {
            res.status(400).json({
                error: err,
                message: "Error fetching a session key."
            })
        });
});

module.exports = router;