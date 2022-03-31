'use strict';

const isEmpty = require('lodash').isEmpty;

class Applicant {
    constructor(formdata) {
        this.formdata = formdata || {};
    }

    applicantHasDeclared() {
        return !isEmpty(this.formdata.declaration) && this.formdata.declaration.declarationCheckbox === 'true';
    }

    isApplicantChild() {
        return this.formdata.applicant && (this.formdata.applicant.relationshipToDeceased === 'optionChild' || this.formdata.applicant.relationshipToDeceased === 'optionAdoptedChild');
    }

    isSpouseRenouncing() {
        return this.formdata.applicant && this.formdata.applicant.spouseNotApplyingReason === 'optionRenouncing';
    }

}

module.exports = Applicant;
