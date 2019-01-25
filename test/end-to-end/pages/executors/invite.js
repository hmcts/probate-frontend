'use strict';

const content = require('app/resources/en/translation/executors/invite');
const pageUnderTest = require('app/steps/ui/executors/invite/index');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.waitForNavigationToComplete(`input[value="${content.sendInvites}"]`);
};
