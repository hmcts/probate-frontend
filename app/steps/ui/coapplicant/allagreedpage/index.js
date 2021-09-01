'use strict';

const Step = require('app/core/steps/Step');

class CoApplicantAllAgreedPage extends Step {

    static getUrl () {
        return '/co-applicant-all-agreed-page*';
    }
}

module.exports = CoApplicantAllAgreedPage;
