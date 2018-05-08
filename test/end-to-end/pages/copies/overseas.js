const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/copies/overseas/index');

module.exports = function (copies) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.fillField('#overseas', copies);

    I.click(commonContent.continue);
};
