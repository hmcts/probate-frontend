'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/iht/method/index');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#method-paperOption');

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
