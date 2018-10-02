'use strict';

const AddressStep = require('app/core/steps/AddressStep');

module.exports = class DeceasedAddress extends AddressStep {

    static getUrl() {
        return '/deceased-address';
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'isToggleEnabled', value: true, choice: 'toggleOn'}
            ]
        };
    }
};
