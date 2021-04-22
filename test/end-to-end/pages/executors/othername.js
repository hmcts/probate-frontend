'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');

module.exports = async function(language = 'en', executorsWithDifferentNameIdList) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;

    await I.checkPageUrl('app/steps/ui/executors/othername');

    for (let i = 0; i < executorsWithDifferentNameIdList.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        await I.checkOption('#executorsWithOtherNames-' + executorsWithDifferentNameIdList[i]);
    }
    await I.navByClick(commonContent.saveAndContinue);
};
