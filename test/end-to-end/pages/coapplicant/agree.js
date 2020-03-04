'use strict';

const pageUnderTest = require('app/steps/ui/coapplicant/agreepage');

module.exports = function(elementId) {
    const I = this;

    I.retry(5).amOnLoadedPage(pageUnderTest.getUrl());

    if (elementId === 0) {
        I.see('When everyone');
    } else {
        I.see('All executors applying');
    }
};
