'use strict';

const testConfig = require('config');

module.exports = () => {
    const I = this;

    I.retry(testConfig.TestRetrySteps).waitForText('Enter card details', testConfig.TestWaitForTextToAppear);

    I.seeInCurrentUrl(testConfig.TestGovUkCardPaymentsUrl);

    I.fillField('#card-no', testConfig.govPayTestCardNos.validCardNo);
    I.fillField('#expiry-month', testConfig.govPayTestCardDetails.expiryMonth);
    I.fillField('#expiry-year', testConfig.govPayTestCardDetails.expiryYear);
    I.fillField('#cardholder-name', testConfig.govPayTestCardDetails.cardholderName);
    I.fillField('#cvc', testConfig.govPayTestCardDetails.cvc);
    I.fillField('#address-line-1', testConfig.govPayTestCardDetails.addressLine1);
    I.fillField('#address-city', testConfig.govPayTestCardDetails.addressCity);
    I.fillField('#address-postcode', testConfig.govPayTestCardDetails.addressPostcode);
    I.wait(3);
    I.fillField('#email', testConfig.TestEnvEmailAddress);

    I.click('#submit-card-details');
};
