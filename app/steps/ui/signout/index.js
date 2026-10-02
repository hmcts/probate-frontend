'use strict';

const Step = require('app/core/steps/Step');
const config = require('config');

class SignOut extends Step {

    static getUrl () {
        return '/sign-out';
    }

    shouldHaveBackLink() {
        return false;
    }
}

module.exports = SignOut;
