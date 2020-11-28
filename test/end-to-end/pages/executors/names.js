'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(totalExecutors) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/executors/names');
    let i = 0;

    while (i < (parseInt(totalExecutors) - 1)) {
        const locator = {css: `#executorName_${i}`};
        // eslint-disable-next-line no-await-in-loop
        await I.waitForElement(locator);
        // eslint-disable-next-line no-await-in-loop
        await I.fillField(locator, 'exec' + (i + 2));
        i += 1;
    }

    await I.navByClick(commonContent.saveAndContinue);
};
