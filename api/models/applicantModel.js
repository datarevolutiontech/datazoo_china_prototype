// Applicant Model file
const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // ------
    // Page 1
    // ------
    fullName             : { type: String , required: true  },
    dateOfBirth          : { type: Date   , required: true  },
    gender               : { type: String , required: true  },
    otherNames           : { type: String , required: false },
    citizenship          : { type: String , required: true  },
    placeOfBirth         : { type: String , required: true  },
    countryOfBirth       : { type: String , required: true  },
    chineseCommercialCode: { type: String , required: false },
    chineseNationalId    : { type: String , required: true  },
    passportNo           : { type: String , required: true  },
    dateOfIssue          : { type: Date   , required: true  },
    dateOfExpiry         : { type: Date   , required: true  },

    // ------
    // Page 2
    // ------

    flatNo     : { type: Number, required: false },
    entranceNo : { type: Number, required: false },
    buildingNo : { type: Number, required: false },
    streetNo   : { type: Number, required: true  },
    streetName : { type: String, required: true  },
    complexName: { type: String, required: false },
    district   : { type: String, required: true  },
    city       : { type: String, required: true  },
    province   : { type: String, required: true  },
    telephone  : { type: Number, required: true  },
    email      : { type: String, required: true  },

    // ------
    // Page 3
    // ------

    // ------
    // Page 4
    // ------

    // ------
    // Page 5
    // ------

    // ------
    // Page 6
    // ------

    // ------
    // Page 7
    // ------
});

module.exports = mongoose.model('Applicant', applicantSchema);