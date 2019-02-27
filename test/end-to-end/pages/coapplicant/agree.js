'use strict';

const pageUnderTest = require('app/steps/ui/coapplicant/agreepage/index');

module.exports = function (elementId) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (elementId === 0) {
        I.see('When everyone');
    } else {
        I.see('All executors applying');
    }
};
