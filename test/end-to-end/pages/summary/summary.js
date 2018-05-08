const pageUnderTest = require('app/steps/ui/summary/index'),
      commonContent = require('app/resources/en/translation/common.json');

module.exports = function (redirect) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl(redirect));

    I.click(commonContent.continue);
};
