'use strict';

const testConfig = require('config');

module.exports = async (url = '*') => {
    const I = this;

    if (testConfig.useIdam !== 'false') {
        await I.checkInUrl(`/stop-page/${url}`);
    }

    await I.clickBrowserBackButton();
};
