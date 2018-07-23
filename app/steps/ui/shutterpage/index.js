'use strict';

const Step = require('app/core/steps/Step');

module.exports = class ShutterPage extends Step {

    static getUrl() {
        return '/shutter-page';
    }
};
