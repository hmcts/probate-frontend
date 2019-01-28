'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/deathcertificate/index');

module.exports = function (option) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#deathCertificate-option' + option);

    I.waitForNavigationToComplete(`input[value="${commonContent.continue}"]`);
};
