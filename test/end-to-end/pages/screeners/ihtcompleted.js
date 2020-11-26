'use strict';

const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/screeners/ihtcompleted');

module.exports = async function(answer) {
    const I = this;

    await I.waitForText(content.question);

    const locator = {css: `#completed${answer}`};
    await I.seeElement(locator);
    await I.click(locator);

    await I.navByClick(commonContent.continue);
};
