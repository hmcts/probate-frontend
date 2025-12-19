'use strict';

const ValidationStep = require('app/core/steps/ValidationStep.cjs');

class WaitingForHmrc extends ValidationStep {

    static getUrl() {
        return '/waiting-for-hmrc';
    }

}

module.exports = WaitingForHmrc;
