'use strict';

const Helper = codecept_helper;
const helperName = 'Puppeteer';
const testConfig = require('test/config');

class PuppeteerHelper extends Helper {

    clickBrowserBackButton() {
        const page = this.helpers[helperName].page;

        return page.goBack();
    }

    async uploadDocumentIfNotMicrosoftEdge() {
        const helper = this.helpers[helperName];

        await helper.waitForElement('.dz-hidden-input', testConfig.TestWaitForElementToAppear * testConfig.TestOneMilliSecond);
        await helper.attachFile('.dz-hidden-input', testConfig.TestDocumentToUpload);
        await helper.waitForEnabled('#button', testConfig.TestWaitForElementToAppear);
    }
}
module.exports = PuppeteerHelper;
