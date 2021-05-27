const {decodeHTML} = require('test/end-to-end/helpers/GeneralHelpers');

class JSWait extends codecept_helper {

    async _beforeStep(step) {

        const helper = this.helpers.WebDriver || this.helpers.Puppeteer;

        if (step.name === 'seeCurrentUrlEquals' || step.name === 'seeInCurrentUrl') {
            return helper.waitForElement('body', 30);
        }

        if (step.name === 'waitForText') {
            // this handles decoding any HTML coded characters in the text
            step.args[0] = await decodeHTML(step.args[0].trim());
        }
    }

    async navByClick(text, locator = null, webDriverWait = 2) {
        const helper = this.helpers.WebDriver || this.helpers.Puppeteer;
        const helperIsPuppeteer = this.helpers.Puppeteer;

        if (locator === 'button.govuk-button') {
            await helper.waitForEnabled(locator);
        }

        if (helperIsPuppeteer) {
            helper.click(text, locator).catch(err => {
                console.error(err.message);
            });
            await helper.page.waitForNavigation({waitUntil: ['domcontentloaded', 'networkidle0']});
            return;
        }

        // non Puppeteer
        await helper.click(text, locator);
        await helper.wait(webDriverWait);
    }

    async amOnLoadedPage (url, language ='en') {
        let newUrl = `${url}?lng=${language}`;
        const helper = this.helpers.WebDriver || this.helpers.Puppeteer;
        const helperIsPuppeteer = this.helpers.Puppeteer;

        if (helperIsPuppeteer) {
            if (newUrl.indexOf('http') !== 0) {
                newUrl = helper.options.url + newUrl;
            }

            helper.page.goto(newUrl).catch(err => {
                console.error(err.message);
            });
            await helper.page.waitForNavigation({waitUntil: 'networkidle0'});

        } else {
            await helper.amOnPage(newUrl);
            await helper.waitInUrl(url);
            await helper.waitForElement('body');
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

    // This really slows things down as the require needs
    // to load the object just to get the url.

    // It is an anti-pattern as we don't know what
    // work is going on in each constructor and that work
    // might not be applicable to run in a test context.

    // Therefore we should move away from using this method and instead call
    // checkUrl below with the string url we are expecting to find.
    // If there is a need for this to be the same as the url in the application
    // object, use constants.
    async checkPageUrl(pageUnderTestClass, redirect) {
        // optimisation - don't need to do this for puppeteer
        const helper = this.helpers.WebDriver;
        if (helper) {
            const pageUnderTest = require(pageUnderTestClass);
            const url = redirect ? pageUnderTest.getUrl(redirect) : pageUnderTest.getUrl();
            await this.checkInUrl(url);
        }
    }

    async checkInUrl(url, timeoutWait=120) {
        // do for both Puppeteer and Webdriver - doesn't take long
        const helper = this.helpers.WebDriver || this.helpers.Puppeteer;
        try {
            await helper.waitInUrl(url, timeoutWait);
        } catch (e) {
            try {
                // ok I know its weird invoking this when we know this can't be the url,
                // but this may give us more information
                console.info('Invoking seeInCurrentUrl for more info on incorrect url');
                await helper.seeInCurrentUrl(url);
                throw e;
            } catch (e2) {
                console.error(e2.message);
                throw e;
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
