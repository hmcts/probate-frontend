const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/copies/summary/index');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.click(commonContent.continue);
};
