'use strict';

const isEmpty = require('lodash').isEmpty;

class Applicant {
    constructor(formdata) {
        this.formdata = formdata || {};
    }

    applicantHasDeclared() {
        return !isEmpty(this.formdata.declaration) && this.formdata.declaration.declarationCheckbox === 'true';
    }
}

module.exports = Applicant;
