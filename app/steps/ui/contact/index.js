'use strict';

const Step = require('app/core/steps/Step');

module.exports = class ContactUs extends Step {

    static getUrl () {
        return '/contact-us';
    }
};
