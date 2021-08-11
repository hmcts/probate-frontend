'use strict';

const config = require('config');
const {decodeHTML} = require('test/end-to-end/helpers/GeneralHelpers');

module.exports = async function(language = 'en') {
    const I = this;
    const content = require(`app/resources/${language}/translation/executors/invite`);

    await I.checkInUrl('/executors-invite');
    await I.waitForText(content.title, config.TestWaitForTextToAppear, 'h1');
    await I.navByClick(await decodeHTML(content.sendInvites.trim()), '.govuk-button');
};
