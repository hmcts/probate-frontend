'use strict';

const pageUnderTest = require('app/steps/ui/coapplicant/declaration');

module.exports = function(answer) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.click(`#agreement${answer}`);

    I.navByClick('#acceptAndSend');
};
