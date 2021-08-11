'use strict';

const Helper = codecept_helper;
const helperName = 'Puppeteer';
const testConfig = require('config');

const countObjects = async (page) => {
    const prototypeHandle = await page.evaluateHandle(() => Object.prototype);
    const objectsHandle = await page.queryObjects(prototypeHandle);
    const numberOfObjects = await page.evaluate((instances) => instances.length, objectsHandle);

    await prototypeHandle.dispose();
    await objectsHandle.dispose();

    return numberOfObjects;
};

class PuppeteerHelper extends Helper {

    clickBrowserBackButton() {
        const page = this.helpers[helperName].page;

        return page.goBack();
    }

    async downloadPdfIfNotIE11(pdfLink) {
        const helper = this.helpers[helperName];
        await helper.click(pdfLink);
    }

    async uploadDocumentIfNotMicrosoftEdge() {
        const helper = this.helpers[helperName];
        await helper.waitForElement('.dz-hidden-input', testConfig.TestWaitForElementToAppear * testConfig.TestOneMilliSecond);
        await helper.attachFile('.dz-hidden-input', testConfig.TestDocumentToUpload);
        // await helper.waitForEnabled('#button', testConfig.TestWaitForElementToAppear);
    }

    async memoryLeakTestBefore(pageName) {
        const page = this.helpers[helperName].page;
        // eslint-disable-next-line no-undef
        const numberOfObjectsBefore = await countObjects(page);
        console.log(`${pageName}>>>>`, numberOfObjectsBefore);
    }

    async memoryLeakTestAfter(pageName) {
        const page = this.helpers[helperName].page;
        // eslint-disable-next-line no-undef
        const numberOfObjectsAfter = await countObjects(page);
        console.log(`${pageName}>>>>`, numberOfObjectsAfter);
    }
}
module.exports = PuppeteerHelper;
