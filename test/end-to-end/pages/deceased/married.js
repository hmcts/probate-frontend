'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const config = require('config');

const deceasedContentEn = 'get married or enter into a civil partnership';
const deceasedContentCy = 'briodi neu ymrwymo i bartneriaeth sifil ar';

module.exports = async function(language ='en', answer) {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const deceasedContent = language === 'en' ? deceasedContentEn : deceasedContentCy;

    await I.checkPageUrl('app/steps/ui/deceased/married');
    await I.waitForText(deceasedContent, config.TestWaitForTextToAppear);

    const locator = {css: `#married${answer}`};
    await I.waitForElement(locator);
    await I.click(locator);
    await I.navByClick(commonContent.saveAndContinue);
};
