'use strict';

const pageUnderTest = require('app/steps/ui/iht/paper');
const commonContent = require('app/resources/en/translation/common');

module.exports = function(formName, grossAmount, netAmount) {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());

    I.click(`#paperIHT${formName}`);

    I.fillField(`#grossValueFieldIHT${formName}`, grossAmount);
    I.fillField(`#netValueFieldIHT${formName}`, netAmount);

    I.navByClick(commonContent.saveAndContinue);
};
