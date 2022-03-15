'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class DeceasedWrittenWishes extends ValidationStep {

    static getUrl() {
        return '/deceased-written-wishes';
    }

}

module.exports = DeceasedWrittenWishes;
