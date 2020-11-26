'use strict';

const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/screeners/deathcertificatetranslation');

module.exports = async function(answer) {
    const I = this;

    await I.waitForText(content.question);

    const locator = {css: `#deathCertificateTranslation${answer}`};
    await I.seeElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.continue);
};
