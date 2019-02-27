'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/assetsoutside/index');

module.exports = function (answer) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click(`#assetsOutside-option${answer}`);

    I.waitForNavigationToComplete(`input[value="${commonContent.saveAndContinue}"]`);
};
