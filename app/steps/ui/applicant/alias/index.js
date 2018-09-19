'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class ApplicantAlias extends ValidationStep {

    static getUrl() {
        return '/applicant-alias';
    }
}

module.exports = ApplicantAlias;
