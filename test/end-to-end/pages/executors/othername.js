'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(executorsWithDifferentNameIdList) {
    const I = this;

    await I.checkPageUrl('app/steps/ui/executors/othername');

    executorsWithDifferentNameIdList.forEach((executorListId) => {
        await I.checkOption('#executorsWithOtherNames-' + executorListId);
    });

    await I.navByClick(commonContent.saveAndContinue);
};
