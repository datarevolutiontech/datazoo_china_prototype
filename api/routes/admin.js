const express  = require('express' );
const mongoose = require('mongoose');
const request  = require('request' );

const SessionKeys = require('../models/sessionKeyModel');

const datazoo_authenticate_url = "http://dzrest.kmsconnect.com/api/Authenticate.json";

router = express.Router();
router.get('/sessionToken/all', (req, res, next) => {
    SessionKeys.find()
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
                let username = req.body.username;
                let password = req.body.password;

                if (username == undefined || password == undefined) {
                    throw "Username or password was not defined, can't fetch session key";
                } else {
                    let token = ""

                    request
                        .post(datazoo_authenticate_url,
                            {
                                json: {
                                    "UserName": username,
                                    "Password": password
                                },
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            },
                            function (error, response, body) {
                                if (error) {
                                    throw error;
                                } else {
                                    token = body.sessionToken;
                                    console.log(token);

                                    SessionKeys
                                        .create({
                                            username: username,
                                            sessionKey: token,
                                            timestamp: current_timestamp
                                        });

                                    res.status(200).json({
                                        sessionKey: token,
                                        message: "Created new session key"
                                    })
                                }
                            }
                        )
                }
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