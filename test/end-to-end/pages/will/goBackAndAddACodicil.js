'use strict';

module.exports = async function({language = 'en', codicilsNumber} = {}) {
    const I = this;

    const summaryContent = require(`app/resources/${language}/translation/summary`);
    const codicilContent = require(`app/resources/${language}/translation/will/codicils`);
    const codicilNumberContent = require(`app/resources/${language}/translation/will/codicilsnumber`);

    await I.checkInUrl('/task-list');
    await I.navByClick({css: 'ol.task-list > li > div > p > a'});

    await I.waitForText(summaryContent.heading);

    await I.navByClick({css: 'a[href="/will-codicils"]'});
    await I.waitForText(codicilContent.title);
    const codicilsLocator = {css: '#codicils'};
    await I.waitForEnabled(codicilsLocator);
    await I.click(codicilsLocator);

    await I.navByClick({css: '.govuk-button'});

    await I.checkInUrl('/codicils-number');
    await I.waitForText(codicilNumberContent.title);

    await I.fillField({css: '#codicilsNumber'}, codicilsNumber);
    await I.navByClick({css: 'button.govuk-button'});

    await I.checkInUrl('/codicils-have-damage');
    const damageLocator = {css: '#codicilsHasVisibleDamage-2'};
    await I.waitForEnabled(damageLocator);
    await I.click(damageLocator);
    await I.navByClick({css: 'button.govuk-button'});

    await I.navByClick({css: 'button.govuk-button'});

};
