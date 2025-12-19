'use strict';

const Step = require('app/core/steps/Step.cjs');

class ExecutorsChangeMade extends Step {

    static getUrl () {
        return '/executors-change-made';
    }
}

module.exports = ExecutorsChangeMade;
