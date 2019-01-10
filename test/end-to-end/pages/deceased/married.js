'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/deceased/married/index');

module.exports = function (option) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#married-' + option);

    I.click(commonContent.saveAndContinue);
};
