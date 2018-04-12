const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/iht/completed/index');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#completed-optionYes');

    I.click(commonContent.continue);
};