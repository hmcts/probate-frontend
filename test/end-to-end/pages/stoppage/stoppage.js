'use strict';

const pageUnderTest = require('app/steps/ui/stoppage');
const testConfig = require('config');

module.exports = async (url) => {
    const I = this;

    if (testConfig.useIdam !== 'false') {
        //refactor this, if we can, to avoid constructing the application object
        await I.seeCurrentUrlEquals(pageUnderTest.getUrl(url));
    }

    await I.clickBrowserBackButton();
};
