'use strict';

const pageUnderTest = require('app/steps/ui/stoppage');
const testConfig = require('test/config.js');

module.exports = function(url) {
    const I = this;

    if (testConfig.useIdam !== 'false') {
        I.amOnLoadedPage(pageUnderTest.getUrl(url));
    }

    I.clickBrowserBackButton();
};
