'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(firstname, lastname) {
    const I = this;
    const locatorFn = {css: '#firstName'};
    await I.fillField(locatorFn, firstname);
    await I.fillField({css: '#lastName'}, lastname);

    await I.navByClick(commonContent.saveAndContinue);
};
