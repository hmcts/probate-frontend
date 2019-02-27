'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/maritalstatus/index');

module.exports = function (answer) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click(`#maritalStatus-option${answer}`);

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
