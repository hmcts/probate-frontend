'use strict';
const Step = require('app/core/steps/Step');

module.exports = class CopiesStart extends Step {

    static getUrl() {
        return '/copies-start';
    }
};
