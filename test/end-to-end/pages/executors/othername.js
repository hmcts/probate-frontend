'use strict';

module.exports = async function(language = 'en', executorsWithDifferentNameIdList = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/executors-other-names');

    for (let i = 0; i < executorsWithDifferentNameIdList.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        await I.checkOption('#executorsWithOtherNames-' + executorsWithDifferentNameIdList[i]);
    }
    await I.navByClick(commonContent.saveAndContinue);
};
