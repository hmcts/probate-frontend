'use strict';

const pageUnderTest = require('app/steps/ui/stoppage');
const testConfig = require('config');

module.exports = async (url) => {
    const I = this;

    if (testConfig.useIdam !== 'false') {
        await I.waitInUrl(pageUnderTest.getUrl(url));
    }

    await I.clickBrowserBackButton();
};
