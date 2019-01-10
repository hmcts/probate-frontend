'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/executors/allalive/index');

module.exports = function (option) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    if (option === 'Yes') {
        I.click('#allalive-optionYes');
    } else {
        I.click('#allalive-optionNo');
    }

    I.click(commonContent.saveAndContinue);
};
