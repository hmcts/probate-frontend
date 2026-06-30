'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class DeceasedPartnerName extends ValidationStep {

    static getUrl() {
        return '/deceased-partner-name';
    }
}

module.exports = DeceasedPartnerName;
