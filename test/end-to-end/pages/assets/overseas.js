const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/assets/overseas/index');


module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#assetsoverseas-optionYes');

    I.click(commonContent.continue);
};