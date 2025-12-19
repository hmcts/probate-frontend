'use strict';

const AddressStep = require('app/core/steps/AddressStep.cjs');

class ApplicantAddress extends AddressStep {

    static getUrl() {
        return '/applicant-address';
    }
}

module.exports = ApplicantAddress;
