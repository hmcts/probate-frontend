'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/number/index');

module.exports = function (totalExecutors) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.fillField('#executorsNumber', totalExecutors);

    I.awaitNavigation(() => I.click(commonContent.saveAndContinue));
};
