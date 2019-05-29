'use strict';
const ValidationStep = require('app/core/steps/ValidationStep');

class AnyGrandchildrenUnder18 extends ValidationStep {

    static getUrl() {
        return '/any-grandchildren-under-18';
    }
}

module.exports = AnyGrandchildrenUnder18;
