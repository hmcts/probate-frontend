'use strict';

const config = require('config');

module.exports = async function(
    language = 'en',
    divorce = true,
    known = false,
    year,
    month,
    day) {
    const I = this;

    const commonContent = require(`app/resources/${language}/translation/common`);
    const divorceDateContent = require(`app/resources/${language}/translation/deceased/divorcedate`);

    if (divorce) {
        I.waitForText(divorceDateContent.divorcedParagraph1, config.TestWaitForTextToAppear);
        I.waitForText(divorceDateContent.divorcedParagraph2, config.TestWaitForTextToAppear);
    } else {
        I.waitForText(divorceDateContent.separatedParagraph1, config.TestWaitForTextToAppear);
        I.waitForText(divorceDateContent.separatedParagraph2, config.TestWaitForTextToAppear);
    }

    await I.checkInUrl('/deceased-divorced-or-separation-date');
    await I.waitForEnabled({css: '#divorceDateKnown'});

    if (known) {
        await I.click({css: '#divorceDateKnown'});
        await I.waitForEnabled({css: '#ddivorceDate-day'});

        await I.fillField({css: '#divorceDate-day'}, day);
        await I.fillField({css: '#divorceDate-month'}, month);
        await I.fillField({css: '#divorceDate-year'}, year);
    } else {
        await I.click({css: '#divorceDateKnown-2'});
        I.waitForText(divorceDateContent.optionNoHint, config.TestWaitForTextToAppear);
    }

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
