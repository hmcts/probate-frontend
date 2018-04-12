const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/executors/number/index');


module.exports = function (totalExecutors) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.fillField('#executorsNumber', totalExecutors);

    I.click(commonContent.continue);
};