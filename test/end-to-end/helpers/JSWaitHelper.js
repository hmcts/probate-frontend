class JSWaitHelper extends codecept_helper { // eslint-disable-line camelcase
    _beforeStep(step) {
        const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;

        // Wait for content to load before checking URL
        if (step.name === 'seeCurrentUrlEquals') {
            helper.waitForElement('#content', 300);
        }
    };

    async navByClick (text, locator) {
        const helper = this.helpers['WebDriverIO'] || this.helpers['Puppeteer'];
        const helperIsPuppeteer = this.helpers['Puppeteer'];

        helper.click(text, locator);

        if (helperIsPuppeteer) {
            await helper.page.waitForNavigation({waitUntil: 'networkidle0'});
        } else {
            await helper.waitForElement('#content');
        }
    };
}

module.exports = JSWaitHelper;
