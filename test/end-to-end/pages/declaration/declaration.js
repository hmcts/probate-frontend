'use strict';

const pageUnderTest = require('app/steps/ui/declaration/index');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#declarationCheckbox');

    I.click('#acceptAndSend');
};
