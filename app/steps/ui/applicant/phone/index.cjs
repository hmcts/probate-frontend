'use strict';

const ValidationStep = require('app/core/steps/ValidationStep.cjs');

class ApplicantPhone extends ValidationStep {

    static getUrl() {
        return '/applicant-phone';
    }
}

module.exports = ApplicantPhone;
