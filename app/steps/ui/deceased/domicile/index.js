'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class DeceasedDomicile extends ValidationStep {

    static getUrl() {
        return '/deceased-domicile';
    }
}

module.exports = DeceasedDomicile;
