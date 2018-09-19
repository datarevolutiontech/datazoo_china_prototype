// Applicant Model file
const mongoose = require('mongoose');

const personalInfoSchema = mongoose.Schema({
    firstName             : { type: String    ,      required: true },
    familyName            : { type: String    ,      required: true },
    fullName              : { type: String    ,      default:  ""   },
    dateOfBirth           : { type: String    ,      required: true },
    gender                : { type: String    ,      required: true },
    otherNames            : { type: String    ,      required: false},
    citizenship           : { type: String    ,      required: true },
    placeOfBirth          : { type: String    ,      required: true },
    countryOfBirth        : { type: String    ,      required: true },
    chineseCommercialCode : { type: String    ,      required: false},
    chineseCardNo         : { type: String    ,      required: true },
    chineseNationalId     : { type: String    ,      required: true },
    passportNo            : { type: String    ,      required: true },
    dateOfIssue           : { type: String    ,      required: true },
    dateOfExpiry          : { type: String    ,      required: true }
});

const residentialInfoSchema = mongoose.Schema({
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
    email      : { type: String, required: true  }
});

const workAndEducationSchema = mongoose.Schema({
    occupation          : { type: String, required: false },
    companyName         : { type: String, required: false },
    companyBuildingName : { type: String, required: false },
    companyStreetNo     : { type: Number, required: false },
    companyStreetName   : { type: String, required: false },
    companyDistrict     : { type: String, required: false },
    companyProvince     : { type: String, required: false },
    companyProvince     : { type: String, required: false },
    companyTelephone    : { type: Number, required: false },
    companyEmail        : { type: String, required: false },
    institutionName     : { type: String, required: false },
    studyProgramme      : { type: String, required: false },
    attendanceDateStart : { type: String, required: false },
    attendanceDateEnd   : { type: String, required: false },
});

const militaryServiceSchema = mongoose.Schema({
    militaryRank     : { type: String, required: false },
    militaryUnit     : { type: String, required: false },
    militaryService  : { type: String, required: false },
    militaryDateStart: { type: String, required: false },
    militaryDateEnd  : { type: String, required: false }
});

const relationshipSchema = mongoose.Schema({
    familyMemberName        : { type: String, required: true },
    familyMemberRelationship: { type: String, required: true },
    familyMemberDateOfBirth : { type: String, required: true }
});

const visaTypeSchema = mongoose.Schema({
    visaType             : { type: String, required: false },
    visaOtherInput       : { type: String, required: false },
    visaDateStart        : { type: String, required: true  },
    visaDateEnd          : { type: String, required: true  },
    visaBusinessName     : { type: String, required: false },
    visaBusinessAddress  : { type: String, required: false },
    visaBusinessTelephone: { type: Number, required: false },
    visaBusinessEmail    : { type: String, required: false },
    visaWorkName         : { type: String, required: false },
    visaWorkAddress      : { type: String, required: false },
    visaWorkTelephone    : { type: String, required: false },
    visaWorkEmail        : { type: String, required: false },
    visaStudyArea        : { type: String, required: false },
    visaStudyProgramme   : { type: String, required: false },
    visaStudyInstitution : { type: String, required: false },
    visaStudyStartDate   : { type: Date,   required: false },
    visaStudyEndDate     : { type: Date,   required: false },
});

const NZContactSchema = mongoose.Schema({
    nzContactName      : { type: String, required: true  },
    nzContactAddress   : { type: String, required: false },
    nzContactTelephone : { type: Number, required: false },
    nzContactEmail     : { type: String, required: false }
});

const applicantSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,

    // ------
    // Step 1 (Personal Info)
    // ------

    personalInfo: personalInfoSchema,

    // ------
    // Step 2 (Residential and Contact Info)
    // ------

    residentialInfo: residentialInfoSchema,

    // ------
    // Step 3 (Work and Education)
    // ------

    workAndEducation: workAndEducationSchema,

    // ------
    // Step 4 (Military)
    // ------

    militaryHistory: [militaryServiceSchema],

    // ------
    // Step 5 (Relationships)
    // ------

    relationships: [relationshipSchema],

    // ------
    // Step 6 (Type of Visa)
    // ------

    visaType: visaTypeSchema,

    // ------
    // Step 7 (New Zealand Contacts)
    // ------

    nzContacts: [NZContactSchema]
},
{
    toObect: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

applicantSchema.pre('findOneAndUpdate', function(next) {
    // Combine first and family name into full name
    if (this._update.personalInfo != null) {
        // let fullName = this.personalInfo.firstName + this.personalInfo.familyName;
        fullName = this._update.personalInfo.firstName + " " +  this._update.personalInfo.familyName;
        this._update.personalInfo.fullName = fullName;
    }

    // Github hackery to fix next not being a function
    if (!(next instanceof Function)) {
        data = next
        next = function() {}
    }
    next();
})

applicantSchema.virtual('isComplete').get(function () {
    // Update entry is complete status
    complete = false;
    // TODO: More comprehensive error checking
    if (this.personalInfo != null && this.residentialInfo != null
            && this.workAndEducation != null && this.relationships != null
            && this.visaType != null) {
        complete = true;
    }
    return complete;
})

applicantSchema.static.validatePersonalInfo = function(data) {
    // Check data is valid
    return true;
}

applicantSchema.static.validateResidentialInfo = function(data) {
    // Check data is valid
    return true;
}

applicantSchema.static.validateWorkAndEducation = function(data) {
    // Check data is valid
    return true;
}

applicantSchema.methods.validateMilitaryHistory = function(data) {
    // Check data is valid
    return true;
}

applicantSchema.static.validateRelationships = function(data) {
    // Check data is valid
    return true;
}

applicantSchema.static.validateVisaType = function(data) {
    // Check data is valid
    return true;
}

applicantSchema.static.validateNZContacts = function(data) {
    // Check data is valid
    return true;
}

module.exports = mongoose.model('Applicant', applicantSchema);