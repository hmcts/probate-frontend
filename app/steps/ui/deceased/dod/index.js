'use strict';

const DateStep = require('app/core/steps/DateStep');

module.exports = class DeceasedDod extends DateStep {

    static getUrl() {
        return '/deceased-dod';
    }

    dateName() {
        return 'dod';
    }
};
