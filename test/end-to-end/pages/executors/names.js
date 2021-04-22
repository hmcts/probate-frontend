'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');

module.exports = async function(language = 'en', totalExecutors) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;

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
