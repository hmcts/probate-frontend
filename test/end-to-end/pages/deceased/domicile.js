'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/domicile/index');

module.exports = function (option) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.click('#domicile-option' + option);

    I.waitForNavigationToComplete(`input[value="${commonContent.continue}"]`);
};
