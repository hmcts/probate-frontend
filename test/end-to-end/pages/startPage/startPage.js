const pageUnderTest = require('app/steps/ui/startpage/index');
const testConfig = require('test/config.js');

module.exports = function () {
    const I = this;

    const useIdam = process.env.TEST_USE_IDAM || testConfig.TestUseIdam;

    if (useIdam !== 'true') {
        I.amOnPage(pageUnderTest.getUrl());
        I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    }

    I.click('Start now');

};
