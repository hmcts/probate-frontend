'use strict';

const Step = require('app/core/steps/Step');

module.exports = class ExecutorsChangeMade extends Step {

    static getUrl () {
        return '/executors-change-made';
    }
};
