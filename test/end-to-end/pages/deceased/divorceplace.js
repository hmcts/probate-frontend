'use strict';

const commonContent = require('app/resources/en/translation/common');

module.exports = async function(answer) {
    const I = this;
    await I.checkInUrl('/deceased-divorce-place');
    await I.waitForEnabled({css: `#divorcePlace ${answer}`});
    await I.click({css: `#divorcePlace ${answer}`});

    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
