const express = require('express');
router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Handle GET requests sent to /applicants"
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: "Handle POST requests sent to /applicants"
    });
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

module.exports = router;