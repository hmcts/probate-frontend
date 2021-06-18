'use strict';

const config = require('config');

module.exports = async function(language = 'en') {
    const I = this;
    const content = require(`app/resources/${language}/translation/coapplicant/agreepage`);
    await I.checkInUrl('/co-applicant-agree-page');
    await I.waitForText(content.subHeader, config.TestWaitForTextToAppear);
};
