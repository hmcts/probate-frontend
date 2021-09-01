'use strict';

const Step = require('app/core/steps/Step');

class CopiesStart extends Step {

    static getUrl() {
        return '/copies-start*';
    }
}

module.exports = CopiesStart;
