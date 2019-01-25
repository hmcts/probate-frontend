'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/copies/overseas/index');

module.exports = function (copies) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.fillField('#overseas', copies);

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);

};
