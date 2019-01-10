'use strict';

const pageUnderTest = require('app/steps/ui/thankyou/index');
const thankYouContent = require('app/resources/en/translation/thankyou');

module.exports = function () {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.see(thankYouContent.header);
};
