'use strict';

const pageUnderTest = require('app/steps/ui/executors/additionalinvite/index');
const inviteContent = require('app/resources/en/translation/executors/invite.json');

module.exports = function () {
    const I = this;

    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    I.waitForNavigationToComplete(`input[value="${inviteContent.question}"]`);
};
