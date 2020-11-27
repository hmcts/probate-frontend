'use strict';

const config = require('config');

module.exports = async function() {
    const I = this;

    const url = await I.grabCurrentUrl();
    console.info(`equality url: ${url}`);

    // await I.checkPageUrl('app/steps/ui/equality');
    const backButtonLocator = {css: '#back-button'};
    await I.waitForElement(backButtonLocator, config.TestWaitForElementToAppear);
    await I.waitForText('Equality and diversity questions', config.TestWaitForTextToAppear);
    await I.navByClick(backButtonLocator);
};
