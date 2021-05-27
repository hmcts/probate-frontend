'use strict';

module.exports = async function(language = 'en', totalExecutors = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/executors-names');
    let i = 0;

    while (i < (parseInt(totalExecutors) - 1)) {
        const locator = {css: `#executorName_${i}`};
        // eslint-disable-next-line no-await-in-loop
        await I.waitForElement(locator);
        // eslint-disable-next-line no-await-in-loop
        await I.fillField(locator, 'exec' + (i + 2));
        i += 1;
    }

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
