const pageUnderTest = require('app/steps/ui/executors/invite/index');


module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.click('Notify the other executors who are applying');
};