// Applicant Model file
const mongoose = require('mongoose');

const personalInfoSchema = mongoose.Schema({
    fullName             : { type: String , required: true  },
    dateOfBirth          : { type: Date   , required: true  },
    gender               : { type: String , required: true  },
    otherNames           : { type: String , required: false },
    citizenship          : { type: String , required: true  },
    placeOfBirth         : { type: String , required: true  },
    countryOfBirth       : { type: String , required: true  },
    chineseCommercialCode: { type: String , required: false },
    chineseCardNumber    : { type: String , required: false },
    chineseNationalId    : { type: String , required: true  },
    passportNo           : { type: String , required: true  },
    dateOfIssue          : { type: Date   , required: true  },
    dateOfExpiry         : { type: Date   , required: true  },
});

const relationshipSchema = mongoose.Schema({
    familyMemberName        : {type: String, required: true},
    familyMemberRelationship: {type: String, required: true},
    familyMemberDateOfBirth : {type: Date  , required: true},
});

const NZContactSchema = mongoose.Schema({
    nzContactName      : { type: String, required:true },
    nzContactAddress   : { type: String, required:true },
    nzContactTelephone : { type: Number, required:true },
    nzContactEmail     : { type: String, required:true }
})

const applicantSchema = mongoose.Schema({
    _id: String, // will this be an int instead?

    // ------
    // Step 1 (Personal Info)
    // ------
    personalInfo: {type: personalInfoSchema, required: true},


    // ------
    // Step 2 (Residential and Contact Info)
    // ------

    // flatNo     : { type: Number, required: false },
    // entranceNo : { type: Number, required: false },
    // buildingNo : { type: Number, required: false },
    // streetNo   : { type: Number, required: true  },
    // streetName : { type: String, required: true  },
    // complexName: { type: String, required: false },
    // district   : { type: String, required: true  },
    // city       : { type: String, required: true  },
    // province   : { type: String, required: true  },
    // telephone  : { type: Number, required: true  },
    // email      : { type: String, required: true  },

    // ------
    // Step 3 (Work and Education)
    // ------

    // occupation          : { type: , required: },
    // companyName         : { type: , required: },
    // companyBuildingName : { type: , required: },
    // companyStreetNo     : { type: , required: },
    // companyStreetName   : { type: , required: },
    // companyDistrict     : { type: , required: },
    // companyProvince     : { type: , required: },
    // companyProvince     : { type: , required: },
    // companyTelephone    : { type: , required: },
    // companyEmail        : { type: , required: },
    // institutionName     : { type: , required: },
    // studyProgramme      : { type: , required: },
    // attendanceDateStart : { type: , required: },
    // attendanceDateEnd   : { type: , required: },

    // ------
    // Step 4 (Military)
    // ------


    // ------
    // Step 5 (Relationships)
    // ------

    relationships: {type: [relationshipSchema], required: true},

    // ------
    // Step 6 (Type of Visa)
    // ------

    // visaType             : { type: , required: },
    // visaOtherInput       : { type: , required: },
    // visaDateStart        : { type: , required: },
    // visaDateEnd          : { type: , required: },
    // visaBusinessName     : { type: , required: },
    // visaBusinessAddress  : { type: , required: },
    // visaBusinessTelephone: { type: , required: },
    // visaBusinessEmail    : { type: , required: },
    // visaWorkName         : { type: , required: },
    // visaWorkAddress      : { type: , required: },
    // visaWorkTelephone    : { type: , required: },
    // visaWorkEmail        : { type: , required: },
    // visaStudyArea        : { type: , required: },
    // visaStudyProgramme   : { type: , required: },
    // visaStudyInstitution : { type: , required: },
    // visaStudyStartDate   : { type: , required: },
    // visaStudyEndDate     : { type: , required: },

    // ------
    // Step 7 (New Zealand Contacts)
    // ------

    // Is this required?
    nzContacts: {type: [NZContactSchema], required: true}
});

function addData(step, data) {
    console.log("step:", step, "\ndata:", data);

    switch(step) {
        case 1: {
            initiatePersonalInfo(data);
            break;
        }
        case 2: {
            initiate(data);
            break;
        }
        case 3: {
            initiate(data);
            break;
        }
        case 4: {
            initiate(data);
            break;
        }
        case 5: {
            initiateRelationships(data);
            break;
        }
        case 6: {
            initiate(data);
            break;
        }
        case 7: {
            initiateNZContacts(data);
            break;
        }
    }
}

function initiatePersonalInfo(data) {
    // Check data is valid?
    self.personalInfo = new personalInfoSchema(data);
}

function initiateRelationships(data) {
    // Check data is valid?
    self.relationships = new relationshipSchema(data);
}

function initiateNZContacts(data) {
    // Check data is valid?
    self.NZContacts = new NZContactSchema(data);
}

module.exports = mongoose.model('Applicant', applicantSchema);