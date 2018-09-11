const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const applicantRoutes = require('./api/routes/applicants')

mongoose.connect(
    'mongodb+srv://dylandrt:' + process.env.MONGO_ATLAS_PW +
    '@node-rest-shop-qjso9.mongodb.net/test?retryWrites=true',
    { useNewUrlParser: true }
)
mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
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

// Routes that handle requests
app.use('/applicants', applicantRoutes);

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