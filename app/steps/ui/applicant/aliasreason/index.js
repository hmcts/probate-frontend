'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class ApplicantAliasReason extends ValidationStep {

    static getUrl() {
        return '/applicant-alias-reason';
    }
}

module.exports = ApplicantAliasReason;
