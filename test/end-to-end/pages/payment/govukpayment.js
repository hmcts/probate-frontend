'use strict';

const testConfig = require('config');

module.exports = async function() {
    const I = this;

    await I.waitForText('Enter card details');

    await I.waitForElement({css: '#card-no'});
    await I.fillField({css: '#card-no'}, testConfig.govPayTestCardNos.validCardNo);
    await I.fillField({css: '#expiry-month'}, testConfig.govPayTestCardDetails.expiryMonth);
    await I.fillField({css: '#expiry-year'}, testConfig.govPayTestCardDetails.expiryYear);
    await I.fillField({css: '#cardholder-name'}, testConfig.govPayTestCardDetails.cardholderName);
    await I.fillField({css: '#cvc'}, testConfig.govPayTestCardDetails.cvc);
    await I.fillField({css: '#address-line-1'}, testConfig.govPayTestCardDetails.addressLine1);
    await I.fillField({css: '#address-city'}, testConfig.govPayTestCardDetails.addressCity);
    await I.fillField({css: '#address-postcode'}, testConfig.govPayTestCardDetails.addressPostcode);

    await I.waitForElement({css: '#email'});
    await I.fillField({css: '#email'}, testConfig.TestEnvEmailAddress);

    await I.waitForElement({css: '#submit-card-details'});
    await I.click('#submit-card-details');
};
