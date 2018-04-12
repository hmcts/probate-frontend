const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/deceased/dob/index');

module.exports = function (day, month, year) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.fillField('#dob_day', day);
    I.fillField('#dob_month', month);
    I.fillField('#dob_year', year);

    I.click(commonContent.continue);
};