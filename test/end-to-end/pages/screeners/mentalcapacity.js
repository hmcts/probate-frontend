'use strict';

const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/screeners/mentalcapacity/index');

module.exports = function (answer) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click(`#mentalCapacity-option${answer}`);

    I.waitForNavigationToComplete(`input[value="${commonContent.continue}"]`);
};
