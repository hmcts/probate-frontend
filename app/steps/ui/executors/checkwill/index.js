'use strict';

const Step = require('../../../../core/steps/Step');

class ExecutorCheckWill extends Step {

    static getUrl() {
        return '/executor-check-will';
    }
}

module.exports = ExecutorCheckWill;
