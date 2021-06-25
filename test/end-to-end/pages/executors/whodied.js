'use strict';

module.exports = async function(language = 'en', executorsWhoDiedList = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/executors-who-died');
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

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
