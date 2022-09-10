'use strict';

module.exports = async function(language ='en') {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    // we should do something about this - wait for a url or some explicit content and remove this arbitrary wait
    await I.wait(3);
    await I.waitForText(commonContent.saveAndContinue);
    await I.refreshPage();
    await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
};
