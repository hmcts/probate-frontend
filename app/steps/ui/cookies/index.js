'use strict';

const Step = require('app/core/steps/Step');

module.exports = class Cookies extends Step {

    static getUrl () {
        return '/cookies';
    }
};
