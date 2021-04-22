'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');

module.exports = async function(language = 'en', executorsApplyingList) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;

    await I.checkPageUrl('app/steps/ui/executors/dealingwithestate');
    for (let i = 0; i < executorsApplyingList.length; i++) {
        const locator = {css: `#executorsApplying-${parseInt(executorsApplyingList[i]) - 1}`};
        // eslint-disable-next-line no-await-in-loop
        await I.waitForElement(locator);
        // eslint-disable-next-line no-await-in-loop
        await I.checkOption(locator);
    }

    await I.navByClick(commonContent.saveAndContinue);
};
