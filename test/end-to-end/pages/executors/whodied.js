'use strict';

// eslint-disable-next-line no-unused-vars
module.exports = async function(language = 'en', executorsWhoDiedList = null) {
    const I = this;

    await I.checkInUrl('/executors-who-died');
    await I.refreshPage();
    for (let i = 0; i < executorsWhoDiedList.length; i++) {
        const executorNumber = executorsWhoDiedList[i];
        let locator = null;
        if (executorNumber === '2') {
            locator = {css: '#executorsWhoDied'};
        } else {
            locator = {css: `#executorsWhoDied-${parseInt(executorNumber) - 1}`};
        }
        // eslint-disable-next-line no-await-in-loop
        await I.waitForVisible(locator);
        // eslint-disable-next-line no-await-in-loop
        await I.waitForEnabled(locator);
        // eslint-disable-next-line no-await-in-loop
        await I.click(locator);
    }
    await I.click({css: '.govuk-button[data-prevent-double-click="true"]'});
};
