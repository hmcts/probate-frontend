'use strict';

module.exports = async function(language = 'en', totalExecutors = null, answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    if (totalExecutors === 1) {
        await I.checkInUrl('/executors-named');
        const addLocator = {css: `#executorsNamed${answer}`};
        // eslint-disable-next-line no-await-in-loop
        await I.waitForEnabled(addLocator);
        // eslint-disable-next-line no-await-in-loop
        await I.click(addLocator);
        // eslint-disable-next-line no-await-in-loop
        await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
    } else {
        // await I.checkInUrl('/executors-names');
        let i = 0;

        while (i < (parseInt(totalExecutors) - 1)) {
            // eslint-disable-next-line no-await-in-loop
            await I.checkInUrl('/executors-named');
            const addLocator = {css: `#executorsNamed${answer}`};
            // eslint-disable-next-line no-await-in-loop
            await I.waitForEnabled(addLocator);
            // eslint-disable-next-line no-await-in-loop
            await I.click(addLocator);
            // eslint-disable-next-line no-await-in-loop
            await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');

            const locator = {css: '#executorName'};
            // eslint-disable-next-line no-await-in-loop
            await I.waitForEnabled(locator);
            // eslint-disable-next-line no-await-in-loop
            await I.fillField(locator, 'exec' + String.fromCharCode('A'.charCodeAt(0) + i + 2));
            // eslint-disable-next-line no-await-in-loop
            await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
            i += 1;
        }

        await I.checkInUrl('/executors-named');
        const addNoLocator = {css: '#executorsNamed-2'};
        await I.waitForEnabled(addNoLocator);
        await I.click(addNoLocator);
        await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
    }

};
