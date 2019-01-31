'use strict';

const pageUnderTest = require('app/steps/ui/executors/additionalinvite/index');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.waitForNavigationToComplete('input[value="Notify these executors"]');
};
