'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/will/codicils/index');

module.exports = function (option) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click(`#codicils-option${option}`);

    if (option === 'Yes') {
        I.persistMainApplicant('willCodicils', true);
    }

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
