'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

module.exports = class ApplicantName extends ValidationStep {

    static getUrl() {
        return '/applicant-name';
    }
};
