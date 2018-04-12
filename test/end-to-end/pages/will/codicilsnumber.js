const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/will/codicilsnumber/index');

module.exports = function (totalCodicils) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.fillField('#codicilsNumber', totalCodicils);

    I.click(commonContent.continue);
};