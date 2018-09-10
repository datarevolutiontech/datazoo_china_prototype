const express = require('express');
router = express.Router();

router.get('/', (req, res, next) => {
    res.status(400).json({
        message: "You can't send a /GET request to /applicants/. An ID must be provided.",
        example_query: {
            type: "GET",
            URL: "/applicants/201"
        }
    });
});

router.post('/', (req, res, next) => {
    if (is_valid_applicant_data(req.body)) { // body does contain (enough) data
        res.status(200).json({
            message: "Your POST request can be processed. Maybe. At least it isn't empty.",
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

function is_valid_id(id) {
    /* Returns whether the given id is a valid index for the database */

    // TODO: Also check if id is out of bounds for the database, if required
    return (Number.isSafeInteger(Number(id)) && id >= 0);
    // Number(id) returns a number if string can be converted to id, otherwise NaN
    // id is always going to be passed as string, so this had to be used
}

function is_valid_applicant_data(applicant) {
    var len = Object.keys(applicant).length;
    if (len <= 0) { // change this to the minimum data fields required
        return false;
    } else {
        return true;
    }
}

module.exports = router;