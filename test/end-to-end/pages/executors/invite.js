'use strict';

const config = require('config');
const inviteContentEn = require('app/resources/en/translation/executors/invite');
const inviteContentCy = require('app/resources/cy/translation/executors/invite');
const {decodeHTML} = require('test/end-to-end/helpers/GeneralHelpers');

module.exports = async function(language = 'en') {
    const I = this;
    const content = language === 'en' ? inviteContentEn : inviteContentCy;

    await I.checkPageUrl('app/steps/ui/executors/invite');
    await I.waitForText(content.title, config.TestWaitForTextToAppear, 'h1');
    await I.navByClick(await decodeHTML(content.sendInvites.trim()), '.govuk-button');
};
