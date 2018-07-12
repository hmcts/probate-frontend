const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/executors/mentalcapacity/index');

module.exports = function () {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#mentalCapacity-optionYes');

    I.click(commonContent.continue);
};
