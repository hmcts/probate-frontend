'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class WaitingForHmrc extends ValidationStep {

    static getUrl() {
        return '/waiting-for-hmrc';
    }

}

module.exports = WaitingForHmrc;
