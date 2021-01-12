'use strict';

const config = require('config');
const content = require('app/resources/en/translation/executors/invite');

module.exports = async function() {
    const I = this;

    await I.checkPageUrl('app/steps/ui/executors/invite');
    await I.waitForText(content.title, config.TestWaitForTextToAppear, 'h1');
    await I.navByClick(content.sendInvites, '.govuk-button');
};
