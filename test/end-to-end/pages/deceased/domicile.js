const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/deceased/domicile/index');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#domicile-optionYes');

    I.click(commonContent.continue);
};
