const commonContent = require('app/resources/en/translation/common');
const pageUnderTest = require('app/steps/ui/applicant/aliasreason/index');

module.exports = function () {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#aliasDivorce');

    I.click(commonContent.continue);
};
