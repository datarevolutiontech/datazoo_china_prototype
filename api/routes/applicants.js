const express   = require('express');
const app       = require('../../app');
const mongoose  = require('mongoose');
const Applicant = require('../models/applicantModel');

router = express.Router();

router.get('/', (req, res, next) => {
    Applicant.find()
        .select("firstName")
        .exec()
        .then(applicants => {
            console.log(applicants);
            res.status(400).json({
                message: "You can't send a /GET request to /applicants/. An ID must be provided. Here's some data that was found though.",
                example_query: {
                    type: "GET",
                    URL: "/applicants/201"
                },
                applicants: applicant
            })
        })
        .catch(err => {
            console.log(err),

            res.status(400).json({
                message: "You can't send a /GET request to /applicants/. An ID must be provided.",
                example_query: {
                    type: "GET",
                    URL: "/applicants/201"
                }
            })
        });
});

router.post('/', (req, res, next) => {
    if (is_valid_applicant_data(req.body)) { // body does contain (enough) data
        var parameters = req.body;
        parameters['_id'] = mongoose.Types.ObjectId();
        for (param in parameters) {
            console.log(param, parameters[param]);
        }

        const applicant = new Applicant({
            parameters
        });

        console.log(applicant);
        res.status(200).json({
            id: "Your id is: " + parameters['_id'],
            your_query: req.body
        });

    } else {
        res.status(400).json({
            message: "You can't send a /POST request to /applicants/ without proper data. Sufficient applicant details must be provided.",
            example_query: {
                type: "GET",
                URL: "/applicants/",
                data: {
                    data: "Applicant data" // TODO: Insert example of applicant data
                }
            },
            your_query: req.body
        });
    }
});

router.get('/:applicantId', (req, res, next) => {
    const id = req.params.applicantId;
    Applicant.findById(id)
        .exec()
        .then(applicant => {
                res.status(200).json({
                    message: "Valid id",
                    id: id,
                    person: applicant
                })
            }
        )
        .catch(
            res.status(400).json({
                message: "Invalid id",
                id: id
            })
        );
});

router.delete('/:applicantId', (req, res, next) => {
    const id = req.params.applicantId;
    // TODO: delete the id's associated entry
    // Does this need authentication?
    if (is_valid_id(id)) {
        res.status(200).json({
            message: "Valid id",
            id: id
        });
    } else {
        res.status(400).json({
            message: "Invalid id",
            id: id
        });
    }
});

router.patch('/:applicantId', (req, res, next) => {
    const id = req.params.applicantId;
    // TODO: delete the id's associated entry
    // Does this need authentication?
    if (is_valid_id(id)) {
        res.status(200).json({
            message: "Valid id",
            id: id
        });
    } else {
        res.status(400).json({
            message: "Invalid id",
            id: id
        });
    }
});

function is_valid_id(id) {
    /* Returns whether the given id is a valid index for the database */
    let len = String(id).length;
    // TODO: Also check if id is out of bounds for the database, if required
    return (len == 12 || len == 24
            && id_exists_in_database(id));
    // Number(id) returns a number if string can be converted to id, otherwise NaN
    // id is always going to be passed as string, so this had to be used
}

function id_exists_in_database(id) {
    /* Returns whether the id exists in database */
    return true;
}

function is_valid_applicant_data(applicant) {
    /* Returns whether the data provided is valid,
     * and fit to insert into the database
     */
    var len = Object.keys(applicant).length;
    if (len <= 0) { // change this to the minimum data fields required
        return false;
    } else {
        return true;
    }
}

module.exports = router;