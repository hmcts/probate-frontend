const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/will/original/index');

module.exports = function () {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#original-optionYes');

    I.click(commonContent.continue);
};