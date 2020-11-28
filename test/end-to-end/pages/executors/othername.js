'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(executorsWithDifferentNameIdList) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/executors/othername');

    for (let i = 0; i < executorsWithDifferentNameIdList.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        await I.checkOption('#executorsWithOtherNames-' + executorsWithDifferentNameIdList[i]);
    }
    await I.navByClick(commonContent.saveAndContinue);
};
