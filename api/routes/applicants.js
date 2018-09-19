const express   = require('express');
const mongoose  = require('mongoose');
const Applicant = require('../models/applicantModel');

router = express.Router();
let example_id = "313233313233313233313233";

router.get('/', (req, res, next) => {
    Applicant.find()
        .select('-__v')
        .exec()
        .then(applicants => {
            res.status(200).json({
                message: "You can't send a /GET request to /applicants/. An ID must be provided. Here's some data that was found though.",
                example_query: {
                    type: "GET",
                    URL: "/applicants/" + example_id
                },
                applicant_count: applicants.length,
                applicants: applicants
            })
        })
        .catch(err => {
            console.log(err)

            res.status(400).json({
                message: "You can't send a /GET request to /applicants/. An ID must be provided.",
                example_query: {
                    type: "GET",
                    URL: "/applicants/" + example_id
                }
            })
        });
});

router.post('/', (req, res, next) => {
    let parameters = req.body;

    if (parameters.step == null) {
        send_error("Step number not specified");
    } else if (parameters.step != "0" && parameters.id == null) {
        send_error("Id number not specified");
    } else {
        Applicant
            .findById(parameters.id)
            .then(applicant => {
                if (applicant == null || parameters.step == 0) {
                    // Applicant not found, have to create one
                    let applicantID = mongoose.Types.ObjectId();
                    applicant = Applicant.create({ _id: applicantID });

                    res.status(200).json({
                        message: "Created new entry!",
                        id: applicantID
                    });
                } else {
                    let step = parameters.step;
                    let new_data = [];

                    // Check if step being edited is an array in the schema
                    if (step == 4 || step == 5 || step == 7) {
                        for (let service of parameters.data) {
                            new_data.push(service);
                        }
                    } else {
                        new_data = parameters.data;
                    }

                    // Stupid hardcoded hackery. Ask Dylan why it was necessary
                    let editing_params = "";
                    if (step == 1) { editing_params = { "personalInfo": new_data }; }
                    if (step == 2) { editing_params = { "residentialInfo": new_data }; }
                    if (step == 3) { editing_params = { "workAndEducation": new_data }; }
                    if (step == 4) { editing_params = { "militaryService": new_data }; }
                    if (step == 5) { editing_params = { "relationships": new_data }; }
                    if (step == 6) { editing_params = { "visaType": new_data }; }
                    if (step == 7) { editing_params = { "nzContacts": new_data }; }

                    Applicant
                        .findByIdAndUpdate(id = parameters.id, editing_params, { new: true })
                        .then(result => {
                            if (result != null) {
                                res.status(200).json({
                                    message: "Added entries:",
                                    applicant: result
                                });
                            }
                        });
                }
            })
            .catch(err => {
                console.log(err);
                send_error(err);
            })
        }

    function send_error(error_message) {
        res.status(400).json({
            message: "You can't send a /POST request to /applicants/ without proper data. Sufficient applicant details must be provided.",
            example_query: {
                type: "POST",
                URL: "/applicants/",
                data: {
                    data: "Applicant data" // TODO: Insert example of applicant data
                }
            },
            your_query: req.body,
            error: error_message
        });
    };
});

router.get('/:applicantId', (req, res, next) => {
    const id = req.params.applicantId;
    Applicant.findById(id)
        .exec()
        .then(applicant => {
                if (applicant === null) { throw "Applicant not found"; }
                else {
                    res.status(200).json({
                        message: "Valid id",
                        id: id,
                        person: applicant
                    })
                }
            }
        )
        .catch(err => {
            res.status(400).json({
                message: "Invalid id",
                id: id,
                error: err
            })
        });
});

router.delete('/:applicantId', (req, res, next) => {
    const id = req.params.applicantId;
    if (is_valid_id(id)) {
        Applicant.findByIdAndRemove(id)
            .exec()
            .then(details => {
                if (details === null) { throw "Applicant with specified ID not found"; }
                else {
                    res.status(200).json({
                        message: "Delete request processed",
                        id: id,
                        details: details
                    });
                }
            })
            .catch(err => {
                res.status(400).json({
                    message: "Failed to process delete request",
                    id: id,
                    error: err
                });
            });
    }
});

router.post('/retrieveID/', (req, res, next) => {
    let params = req.body;

    let firstName = params.firstName;
    let familyName = params.familyName;
    let chineseCardNo = params.chineseCardNo;
    let chineseNationalId = params.chineseNationalId;

    // Exit early if all the required information isn't provided
    if (firstName         == null ||
        familyName        == null ||
        chineseCardNo     == null ||
        chineseNationalId == null) {
        error_response("Not all the required information was provided.");
    }

    Applicant
        .findOne({
            "personalInfo.firstName": firstName,
            "personalInfo.familyName": familyName,
            "personalInfo.chineseCardNo": chineseCardNo,
            "personalInfo.chineseNationalId": chineseNationalId
        })
        .then(result => {
            res.status(200).json({
                message: "User found!",
                id: result._id,
                result: result,
                your_query: params,
            })
        })
        .catch(error => {
            error_response("Error while looking for relevant user", error);
        })

    function error_response(message, error) {
        res.status(400).json({
            message: message,
            your_query: params,
            error: error
        });
    }
});

router.patch('/:applicantId', (req, res, next) => {
    const id = req.params.applicantId;
    // TODO: delete the id's associated entry
    // Does this need authentication?
    if (is_valid_id(id)) {
        // TODO: Verify that parameters are all valid changes.
        // This would include the keys already existing in the applicant,
        // and the new value conforming to specifications for the entry
        let parameters = req.body;
        Applicant.findByIdAndUpdate(
            id, // id to be updated
            parameters, // parameters to be updated
            { new: true }) // return the new version of the applicant
            .exec()
            .then(response => {
                if (response === null) { send_error("Unable to update item."); }
                res.status(201).json({
                    message: "Updated applicant successfully",
                    updated_applicant: response
                });
            })
            .catch(err => {
                send_error(err);
            });
    } else {
        send_error("Is the id correct?")
    }

    function send_error(error_message) {
        res.status(400).json({
            message: "You can't send a /PATCH request to /applicants/ without proper data. Sufficient applicant details and the correct id must be provided.",
            example_query: {
                type: "PATCH",
                URL: "/applicants/{id}",
            },
            your_query: req.body,
            error: error_message
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

module.exports = router;