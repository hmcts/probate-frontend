const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/will/date/index');

module.exports = function (day, month, year) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('#isWillDate-optionYes');
    I.fillField('willDate_day', day);
    I.fillField('willDate_month', month);
    I.fillField('willDate_year', year);

    I.click(commonContent.continue);

};