const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/applicant/executor/index');

module.exports = function () {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#executor-optionYes');

    I.click(commonContent.continue);
};