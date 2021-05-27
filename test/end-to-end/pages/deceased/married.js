'use strict';

const config = require('config');

const deceasedContentEn = 'get married or enter into a civil partnership';
const deceasedContentCy = 'briodi neu ymrwymo i bartneriaeth sifil ar';

module.exports = async function(language ='en', answer = null) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    const deceasedContent = language === 'en' ? deceasedContentEn : deceasedContentCy;

    await I.checkInUrl('/deceased-married');
    await I.waitForText(deceasedContent, config.TestWaitForTextToAppear);

    const locator = {css: `#married${answer}`};
    await I.waitForClickable(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
