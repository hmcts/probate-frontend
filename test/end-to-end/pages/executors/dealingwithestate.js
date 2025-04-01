'use strict';

module.exports = async function(language = 'en', executorsApplyingList = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/other-executors-applying');
    for (let i = 0; i < executorsApplyingList.length; i++) {
        const locator = {css: `#executorsApplying-${parseInt(executorsApplyingList[i]) - 1}`};
        // eslint-disable-next-line no-await-in-loop
        await I.waitForEnabled(locator);
        // eslint-disable-next-line no-await-in-loop
        await I.checkOption(locator);
    }

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
