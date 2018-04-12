const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/applicant/nameasonwill/index');


module.exports = function () {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#nameAsOnTheWill-optionYes');

    I.click(commonContent.continue);
};