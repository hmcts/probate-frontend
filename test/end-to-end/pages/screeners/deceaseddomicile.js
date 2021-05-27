'use strict';

module.exports = async function(language ='en') {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const deceasedDomicileContent = require(`app/resources/${language}/translation/screeners/deceaseddomicile`);

    await I.waitForText(deceasedDomicileContent.question);
    await I.checkInUrl('/deceased-domicile');
    await I.see(deceasedDomicileContent.hintText1);

    await I.click(deceasedDomicileContent.optionYes);
    await I.navByClick(commonContent.continue);
};
