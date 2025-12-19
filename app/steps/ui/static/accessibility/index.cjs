'use strict';

const Step = require('app/core/steps/Step.cjs');

class Accessibility extends Step {

    static getUrl () {
        return '/accessibility-statement';
    }
}

module.exports = Accessibility;
