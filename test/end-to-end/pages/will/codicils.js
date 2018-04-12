const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/will/codicils/index');

module.exports = function (option) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (option === 'Yes') {
        I.click('#codicils-optionYes');
    } else {
        I.click('#codicils-optionNo');
    }

    I.click(commonContent.continue);
};