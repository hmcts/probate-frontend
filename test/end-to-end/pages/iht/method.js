'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/iht/method/index');

module.exports = function (method) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (method === 'Post') {
        I.click('#method-paperOption');
    } else {
        I.click('#method-onlineOption');
    }

    I.click(commonContent.saveAndContinue);
};
