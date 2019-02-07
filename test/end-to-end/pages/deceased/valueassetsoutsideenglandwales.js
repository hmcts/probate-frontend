'use strict';

const pageUnderTest = require('app/steps/ui/deceased/valueassetsoutside/index');
const commonContent = require('app/resources/en/translation/common');

module.exports = function (netAmount) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.fillField('#netValueAssetsOutside', netAmount);

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
