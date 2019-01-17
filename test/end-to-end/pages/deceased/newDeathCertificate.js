'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/newdeathcertificate/index');

module.exports = function () {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#deathCertificate-optionYes');
    I.click(commonContent.continue);
};
