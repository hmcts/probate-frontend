'use strict';

const testConfig = require('test/config');

module.exports = function () {
    const I = this;

    I.fillField('#card-no', '4242424242424242');
    I.fillField('#expiry-month', '06');
    I.fillField('#expiry-year', '99');
    I.fillField('#cardholder-name', 'Test Payment');
    I.fillField('#cvc', '123');
    I.fillField('#address-line-1', '1');
    I.fillField('#address-city', 'London');
    I.fillField('#address-postcode', 'SW1A1AA');
    I.fillField('#email', testConfig.TestEnvEmailAddress);

    I.click('#submit-card-details');
};
