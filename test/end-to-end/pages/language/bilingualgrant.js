'use strict';

const pageUnderTest = require('app/steps/ui/language');
const commonContent = require('app/resources/en/translation/common');

module.exports = function(answer, testSurvey = false) {
    const I = this;

    if (testSurvey) {
        I.click('body > div.govuk-width-container > div > p > span > a:nth-child(1)');

        I.switchToNextTab(1);

        I.waitForVisible('#cmdGo');

        I.closeCurrentTab();
    }

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.seeCheckboxIsChecked(`#bilingual${answer}`);

    I.navByClick(commonContent.saveAndContinue);

};
