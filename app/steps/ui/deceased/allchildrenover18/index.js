'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class AllChildrenOver18 extends ValidationStep {

    static getUrl() {
        return '/all-children-over-18';
    }
}

module.exports = AllChildrenOver18;
