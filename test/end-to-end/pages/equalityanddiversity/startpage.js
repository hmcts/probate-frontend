'use strict';

const config = require('config');
const equalityEn = 'Equality and diversity questions';
const equalityCy = 'Dydw i ddim eisiau ateb y cwestiynau hyn';

module.exports = async function(language ='en') {
    const I = this;
    const equalityContent = language === 'en' ? equalityEn : equalityCy;
    // we should do something about this - wait for a url or some explicit content and remove this arbitrary wait
    await I.wait(3);

    // const url = await I.grabCurrentUrl();
    // console.info(`equality url: ${url}`);
    // await I.checkPageUrl('app/steps/ui/equality');
    const backButtonLocator = {css: '#back-button'};
    await I.waitForVisible(backButtonLocator, config.TestWaitForElementToAppear);
    const currentUrl = await I.grabCurrentUrl();
    if (!currentUrl.includes('/offline')) {
        await I.waitForText(equalityContent, config.TestWaitForTextToAppear);
    }
    await I.navByClick(backButtonLocator);
};
