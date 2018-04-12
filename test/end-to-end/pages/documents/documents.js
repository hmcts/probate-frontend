const pageUnderTest = require('app/steps/ui/documents/index');

module.exports = function () {
    const I = this;
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.click('#sentDocuments')

    I.click('#button');
};