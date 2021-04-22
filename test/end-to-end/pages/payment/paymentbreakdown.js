'use strict';

const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const paymentContentEn = require('app/resources/en/translation/payment/breakdown');
const paymentContentCy = require('app/resources/cy/translation/payment/breakdown');
const testConfig = require('config');

module.exports = async function(language = 'en') {
    const I = this;
    const commonContent = language === 'en' ? commonContentEn : commonContentCy;
    const paymentContent = language === 'en' ? paymentContentEn : paymentContentCy;

    await I.checkPageUrl('app/steps/ui/payment/breakdown');
    await I.wait(3);
    await I.waitForText(paymentContent.applicationFee, testConfig.TestWaitForTextToAppear);
    await I.waitForText(commonContent.saveAndContinue, testConfig.TestWaitForTextToAppear);
    await I.navByClick(commonContent.saveAndContinue);
};
