'use strict';

const Step = require('app/core/steps/Step');

class ShutterPage extends Step {

    static getUrl() {
        return '/shutter-page';
    }
}

module.exports = ShutterPage;
