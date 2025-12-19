'use strict';

const AddressStep = require('app/core/steps/AddressStep.cjs');

class DeceasedAddress extends AddressStep {

    static getUrl() {
        return '/deceased-address';
    }
}

module.exports = DeceasedAddress;
