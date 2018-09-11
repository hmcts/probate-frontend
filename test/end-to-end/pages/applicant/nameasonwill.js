const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/applicant/nameasonwill/index');

module.exports = function (optionValue) {
    const I = this;
    optionValue = optionValue || 'optionYes';
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click(`#nameAsOnTheWill-${optionValue}`);

    I.click(commonContent.continue);
};
