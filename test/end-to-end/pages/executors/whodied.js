'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(executorsWhoDiedList) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/executors/whodied');
    for (let i = 0; i < executorsWhoDiedList.length; i++) {
        const executorNumber = executorsWhoDiedList[i];
        let locator = null;
        if (executorNumber === '2') {
            locator = {css: '#executorsWhoDied'};
        } else {
            locator = {css: `#executorsWhoDied-${parseInt(executorNumber) - 1}`};
        }
        // eslint-disable-next-line no-await-in-loop
        await I.waitForElement(locator);
        // eslint-disable-next-line no-await-in-loop
        await I.checkOption(locator);

    }

    await I.navByClick(commonContent.saveAndContinue);
};
