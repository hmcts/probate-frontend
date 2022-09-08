'use strict';

// eslint-disable-next-line no-unused-vars
module.exports = async function(language = 'en', executor = null) {
    const I = this;
    //await I.checkInUrl('/executor-address', executor);
    await I.refreshPage();
    await I.enterAddress();
    await I.click({css: '#submitAddress'});
    //await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
