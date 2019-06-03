'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/assets/overseas');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#assetsoverseas-optionYes');

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
