'use strict';

module.exports = async function(language = 'en', executor = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);

    await I.checkInUrl('/executor-address', executor);
    await I.enterAddress();
    await I.navByClick(commonContent.saveAndContinue);
};
