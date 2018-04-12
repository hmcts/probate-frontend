const commonContent = require('app/resources/en/translation/common.json');
const pageUnderTest = require('app/steps/ui/executors/whodied/index');
const {forEach} = require('lodash');

module.exports = function (executorsWhoDiedList) {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    forEach(executorsWhoDiedList, executorNumber => {
        I.checkOption('#executorsWhoDied-'+(parseInt(executorNumber) - 1));
    });

    I.click(commonContent.continue);
};
