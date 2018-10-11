const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
require('dotenv').config()

const applicantRoutes = require('./api/routes/applicants')
const adminRoutes = require('./api/routes/admin');

mongoose
    .connect(process.env.dbURL,
            { authMechanism: 'SCRAM-SHA-1',
            useNewUrlParser: true }
    )
    .catch(err => {
        console.log(err);
    });
mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        )
        return res.status(200).json({})
    }
    next()
})

app.use('/', (req, res, next) => {
    var data = ''
    res.on('data', chunk => { data+=chunk })
    res.on('end', () => {
      console.log(data)
    })

    next()
})

// Routes that handle requests
app.use('/applicants', applicantRoutes);
app.use('/admin', adminRoutes);

// Request went past routes
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

// Error thrown, handle it
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    })
})

module.exports = app
