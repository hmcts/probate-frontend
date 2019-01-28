'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/will/codicilsnumber/index');

module.exports = function (totalCodicils) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.fillField('#codicilsNumber', totalCodicils);

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
