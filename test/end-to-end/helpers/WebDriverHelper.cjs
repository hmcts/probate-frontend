'use strict';

const Helper = codecept_helper;
const testConfig = require('config');

class WebDriverHelper extends Helper {

    clickBrowserBackButton() {
        const browser = this.helpers.WebDriver.browser;

        return browser.back();
    }

    async downloadPdfIfNotIE11(pdfLink) {
        const browserName = this.helpers.WebDriver.config.browser;
        const helper = this.helpers.WebDriver;

        if (browserName !== 'internet explorer') {
            await helper.click(pdfLink);
        }
    }

    async uploadDocumentIfNotMicrosoftEdge() {
        const browserName = this.helpers.WebDriver.config.browser;
        const helper = this.helpers.WebDriver;

        if (browserName !== 'MicrosoftEdge') {
            await helper.waitForElement('.dz-hidden-input', testConfig.TestWaitForElementToAppear * testConfig.TestOneMilliSecond);
            await helper.attachFile('.dz-hidden-input', testConfig.TestDocumentToUpload);
            await helper.waitForEnabled('#button', testConfig.TestWaitForElementToAppear);
        }
    }
}
module.exports = WebDriverHelper;
