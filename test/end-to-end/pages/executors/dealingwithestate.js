'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(executorsApplyingList) {
    const I = this;

    for (let i = 0; i < executorsApplyingList.length; i++) {
        const locator = {css: `#executorsApplying-${parseInt(executorsApplyingList[i]) - 1}`};
        // eslint-disable-next-line no-await-in-loop
        await I.waitForElement(locator);
        // eslint-disable-next-line no-await-in-loop
        await I.checkOption(locator);
    }

    await I.navByClick(commonContent.saveAndContinue);
};
