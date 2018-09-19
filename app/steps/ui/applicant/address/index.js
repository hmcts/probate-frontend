'use strict';

const AddressStep = require('app/core/steps/AddressStep');

module.exports = class ApplicantAddress extends AddressStep {

    static getUrl() {
        return '/applicant-address';
    }

};
