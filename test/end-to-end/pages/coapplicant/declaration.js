'use strict';

const pageUnderTest = require('app/steps/ui/coapplicant/declaration');

module.exports = function(agreeDisagree) {
    const I = this;

    I.amOnLoadedPage(pageUnderTest.getUrl());

    if (agreeDisagree === 'Agree') {
        I.click('#agreement-optionYes');
    } else {
        I.click('#agreement-optionNo');
    }

    I.navByClick('#acceptAndSend');
};
