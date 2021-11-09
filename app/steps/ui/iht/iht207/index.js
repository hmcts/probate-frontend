'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class Iht207Estate extends ValidationStep {

    static getUrl() {
        return '/iht-207';
    }

}

module.exports = Iht207Estate;
