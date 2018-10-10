const express   = require('express');
const mongoose = require('mongoose');

const SessionKeys = require('../models/sessionKeyModel');

router = express.Router();

router.get('/', (req, res, next) => {
    SessionKeys.find()
        .select('-__v')
        .exec()
        .then(keys => {
            res.status(200).json({
                message: "You are meant to send a POST request with your username and password, in order to fetch a key",
                example_query: {
                    type: "POST",
                    URL: "/admin/sessionToken"
                },
                key_count: keys.length,
                keys: keys
            })
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                message: "You are meant to send a POST request with your username and password, in order to fetch a key",
                example_query: {
                    type: "POST",
                    URL: "/admin/sessionToken"
                }
            })
        });
});

router.post('/sessionToken', (req, res, next) => {

    // unix timestamp for comparison purposes
    let current_timestamp = new Date().getTime();

    // -60 for a safety margin
    milliseconds_in_day = (24 * 60 * 60 * 1000) - 60;
    let oldest_permissible_timestamp = current_timestamp - milliseconds_in_day

    SessionKeys
        .findOne({ timestamp: { $gt: oldest_permissible_timestamp } }) // get: greater than
        .then(result => {
            // if not found, create a new Session Key
            if (result == null) {
                res.status(200).json({
                    sessionKey: result,
                    message: "Created new session key"
                })
            }
            // if found
            else {
                res.status(200).json({
                    sessionKey: result,
                    message: "Returning session key"
                })
            }
        })
        .catch(err => {
            res.status(400).json({
                error: err,
                message: "Error fetching a session key"
            })
        });
});

module.exports = router;