'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/screeners/deathcertificate');

module.exports = function(answer, testSurvey = false) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (testSurvey) {
        I.click('body > div.govuk-width-container > div > p > span > a:nth-child(1)');

        I.switchToNextTab(1);

        I.waitForVisible('#cmdGo');

        I.closeCurrentTab();
    }

    I.click(`#deathCertificate${answer}`);

    I.navByClick(commonContent.continue);
};
