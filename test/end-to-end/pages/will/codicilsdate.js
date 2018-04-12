const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/will/codicilsdate/index');

module.exports = function (day, month, year) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.click('#isCodicilsDateYes');
    I.fillField('codicilsDate_day', day);
    I.fillField('codicilsDate_month', month);
    I.fillField('codicilsDate_year', year);

    I.click(commonContent.continue);

};