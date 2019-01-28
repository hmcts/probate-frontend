'use strict';

const pageUnderTest = require('app/steps/ui/summary/index');

module.exports = function (redirect) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl(redirect));
    I.click('#checkAnswerHref');
    I.switchTo();
    I.waitForNavigationToComplete('.button');
};
