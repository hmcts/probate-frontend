'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/deathcertificate');

module.exports = function(answer) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click(`#deceasedDeathCertificate${answer}`);

    I.navByClick(commonContent.saveAndContinue);

};
