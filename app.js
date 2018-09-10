const express    = require('express');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const mongoose   = require('mongoose');
require('dotenv').config();

let   app        = express();

// Route imports
const applicantRoutes = require('./api/routes/applicants');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({}));

let mongo_url = 'mongodb+srv://'
            + process.env.username + ':'
            + process.env.password
            + '@cluster0-xybdm.mongodb.net/test?retryWrites=true';
mongoose.connect(mongo_url, { useMongoClient: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

// CORS headers TODO: Is this needed?
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        '*');

    // Establish what methods are allowed
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT', 'POST', 'GET', 'DELETE'
        );
        return res.status(200).json({});
    }
    next();
});

// Routes that handle requests
app.use('/applicants', applicantRoutes);

// Request went past routes
app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});

// Error thrown, handle it
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    })
});

module.exports = { app, mongoose };