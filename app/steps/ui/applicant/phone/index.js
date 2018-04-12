'use strict';
const ValidationStep = require('app/core/steps/ValidationStep');

module.exports = class ApplicantPhone extends ValidationStep {

    static getUrl() {
        return '/applicant-phone';
    }

};
