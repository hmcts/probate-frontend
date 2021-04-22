'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(noOfAliases) {
    const I = this;
    await I.checkPageUrl('app/steps/ui/deceased/otherNames');
    await I.waitForText('Add another name');
    let i = 1;
    /* eslint-disable no-await-in-loop */
    while (i <= noOfAliases) {
        if (i !== 1) {
            await I.navByClick('Add another name');
        }

        await I.fillField(`#otherNames_name_${i-1}_firstName`, `alias_firstnames_${i}`);
        await I.fillField(`#otherNames_name_${i-1}_lastName`, `alias_lastnames_${i}`);

        i += 1;
    }

    await I.navByClick(commonContent.saveAndContinue);
};
