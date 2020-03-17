'use strict';

const pageUnderTest = require('app/steps/ui/stoppage');
const testConfig = require('test/config.js');

module.exports = (url) => {
    const I = this;

    if (testConfig.useIdam !== 'false') {
        I.seeCurrentUrlEquals(pageUnderTest.getUrl(url));
    }

    I.clickBrowserBackButton();
};
