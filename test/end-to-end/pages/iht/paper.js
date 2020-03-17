'use strict';

const pageUnderTest = require('app/steps/ui/iht/paper');
const commonContent = require('app/resources/en/translation/common');

module.exports = function(formName, grossAmount, netAmount) {
    const I = this;
    let option;

    switch (formName) {
    case '207':
        option = '-2';
        break;
    case '421':
        option = '-3';
        break;
    default:
        option = '';
    }

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.click(`#form${option}`);

    I.fillField(`#grossValueFieldIHT${formName}`, grossAmount);
    I.fillField(`#netValueFieldIHT${formName}`, netAmount);

    I.navByClick(commonContent.saveAndContinue);
};
