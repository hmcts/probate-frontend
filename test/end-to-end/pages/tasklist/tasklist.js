const pageUnderTest = require('app/steps/ui/tasklist/index');

module.exports = function (link) {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click(link);
};