class JSWait extends codecept_helper {

    _beforeStep(step) {
        const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;

        // Wait for content to load before checking URL
        if (step.name === 'seeCurrentUrlEquals' || step.name === 'seeInCurrentUrl') {
            return helper.wait(3);
        }
    }

    async navByClick (text, locator) {
        const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;
        const helperIsPuppeteer = this.helpers.Puppeteer;

        if (helperIsPuppeteer) {
            await Promise.all([
                helper.page.waitForNavigation({waitUntil: ['domcontentloaded', 'networkidle0']}),
                locator ? helper.click(text, locator) : helper.click(text)
            ]);
            return;
        }
        await Promise.all([
            helper.click(text, locator),
            helper.wait(3)
        ]);
    }

    async amOnLoadedPage (url) {
        const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;
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
        const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;
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
            const browserName = this.helpers.WebDriverIO.config.browser;

            if (browserName !== 'internet explorer' && browserName !== 'MicrosoftEdge') {
                await helper.browser.waitForVisible('#addressLine1', 5000, true); // true - means wait for element to be Invisible!
                await helper.browser.click('.govuk-details__summary-text');
                await helper.browser.waitForVisible('#addressLine1', 5000, false);
            }

            await helper.browser.setValue('#addressLine1', 'test address for deceased line 1');
            await helper.browser.setValue('#addressLine2', 'test address for deceased line 2');
            await helper.browser.setValue('#addressLine3', 'test address for deceased line 3');
            await helper.browser.setValue('#postTown', 'test address for deceased town');
            await helper.browser.setValue('#newPostCode', 'postcode');
        }
    }

    async checkPageUrl(pageUnderTestClass) {
        // optimisation - don't need to do this for puppeteer
        if (this.helpers.WebDriverIO) {
            const pageUnderTest = require(pageUnderTestClass);
            await this.helpers.WebDriverIO.seeCurrentUrlEquals(pageUnderTest.getUrl());
        }
    }
}

module.exports = JSWait;
