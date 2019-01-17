'use strict';

const pageUnderTest = require('app/steps/ui/documents/index');
const commonContent = require('app/resources/en/translation/common');

module.exports = function () {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('123');

    I.click(commonContent.continue);
};
