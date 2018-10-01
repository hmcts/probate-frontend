'use strict';

const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/applicant/phone');
const pageUnderTest = require('app/steps/ui/applicant/phone/index');

module.exports = function () {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.fillField(content.phoneNumber, '123456789');

    I.click(commonContent.continue);
};
