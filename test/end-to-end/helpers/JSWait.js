class JSWait extends codecept_helper {

    _beforeStep(step) {
        const helper = this.helpers.WebDriver || this.helpers.Puppeteer;

        // Wait for content to load before checking URL
        if (step.name === 'seeCurrentUrlEquals' || step.name === 'seeInCurrentUrl') {
            return helper.wait(3);
        }
    }

    async navByClick(text, locator = null, webDriverWait = 2) {
        const helper = this.helpers.WebDriver || this.helpers.Puppeteer;
        const helperIsPuppeteer = this.helpers.Puppeteer;

        if (helperIsPuppeteer) {
            await Promise.all([
                helper.page.waitForNavigation({waitUntil: ['domcontentloaded', 'networkidle0']}),
                locator ? helper.click(text, locator) : helper.click(text)
            ]);
            return;
        }
        // non Puppeteer
        await helper.click(text, locator);
        await helper.wait(webDriverWait);
    }

    async amOnLoadedPage(url) {
        const helper = this.helpers.WebDriver || this.helpers.Puppeteer;
        const helperIsPuppeteer = this.helpers.Puppeteer;

        if (helperIsPuppeteer) {
            if (url.indexOf('http') !== 0) {
                url = helper.options.url + url;
            }

            await Promise.all([
                helper.page.waitForNavigation({waitUntil: ['domcontentloaded', 'networkidle0']}), // The promise resolves after navigation has finished
                helper.page.goto(url)
            ]);
        } else {
            await helper.amOnPage(url);
            await helper.waitInUrl(url);
        }
    }

    async enterAddress() {
        const helper = this.helpers.WebDriver || this.helpers.Puppeteer;
        const helperIsPuppeteer = this.helpers.Puppeteer;
        const page = helper.page;

        if (helperIsPuppeteer) {
            await helper.page.waitForSelector('#addressLine1', {hidden: true, timeout: 5000});
            await page.click('.govuk-details__summary-text');
            await helper.page.waitForSelector('#addressLine1', {visible: true, timeout: 5000});

            await page.evaluate(() => {
                document.querySelector('#addressLine1').value = 'test address for deceased line 1';
                document.querySelector('#addressLine2').value = 'test address for deceased line 2';
                document.querySelector('#addressLine3').value = 'test address for deceased line 3';
                document.querySelector('#postTown').value = 'test address for deceased town';
                document.querySelector('#newPostCode').value = 'postcode';
            });
        } else {
            await helper.waitForVisible('#postcode');
            await helper.click('.govuk-details__summary-text');
            await helper.waitForVisible('#addressLine1');

            await helper.fillField('#addressLine1', 'test address for deceased line 1');
            await helper.fillField('#addressLine2', 'test address for deceased line 2');
            await helper.fillField('#addressLine3', 'test address for deceased line 3');
            await helper.fillField('#postTown', 'test address for deceased town');
            await helper.fillField('#newPostCode', 'postcode');
        }
    }

    async checkPageUrl(pageUnderTestClass, redirect) {
        // optimisation - don't need to do this for puppeteer
        const helper = this.helpers.WebDriver;
        if (helper) {
            const pageUnderTest = require(pageUnderTestClass);
            const url = redirect ? pageUnderTest.getUrl(redirect) : pageUnderTest.getUrl();
            try {
                await helper.waitInUrl(url, 60);
            } catch (e) {
                try {
                    // ok I know its weird invoking this when we know this can't be the url,
                    // but this may give us more information
                    console.info('Invoking seeInCurrentUrl for more info on incorrect url');
                    await helper.seeInCurrentUrl(url);
                    throw e;
                } catch (e2) {
                    throw e;
                }
            }
        }
    }

    async checkForText(text, timeout = null) {
        const helper = this.helpers.WebDriver || this.helpers.Puppeteer;
        try {
            await helper.waitForText(text, timeout);
        } catch (e) {
            console.log(`Text "${text}" not found on page.`);
            return false;
        }
        return true;
    }
}

module.exports = JSWait;
