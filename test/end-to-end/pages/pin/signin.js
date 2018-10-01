'use strict';

const pageUnderTest = require('app/steps/ui/pin/signin/index');

module.exports = function (pinCode) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.fillField('#pin', pinCode);

    I.click('.button');

};
