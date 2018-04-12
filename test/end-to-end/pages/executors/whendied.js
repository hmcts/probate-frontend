const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/executors/whendied/index');

module.exports = function (executorNumber, diedBefore, firstRecord) {
    const I = this;

     if (firstRecord) {
         I.seeCurrentUrlEquals(pageUnderTest.getUrl());
     } else {
         I.seeCurrentUrlEquals(pageUnderTest.getUrl(parseInt(executorNumber) - 1));
     }

     if (diedBefore) {
         I.click('#diedbefore-optionYes')
     } else {
         I.click('#diedbefore-optionNo');
     }

    I.click(commonContent.continue);
};
