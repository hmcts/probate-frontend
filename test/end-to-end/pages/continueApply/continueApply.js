const pageUnderTest = require('app/steps/ui/continueapply/index');
const testConfig = require('test/config.js');

module.exports = function () {
    const I = this;

    if (testConfig.useIdam !== 'false') {
        I.amOnPage(pageUnderTest.getUrl());
    }
};
