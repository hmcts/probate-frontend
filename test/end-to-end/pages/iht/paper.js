'use strict';

const pageUnderTest = require('app/steps/ui/iht/paper/index');
const commonContent = require('app/resources/en/translation/common');

module.exports = function (formName, grossAmount, netAmount) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.click('#paperIHT' + formName);

    I.fillField('#grossIHT' + formName, grossAmount);
    I.fillField('#netIHT' + formName, netAmount);

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);

};
