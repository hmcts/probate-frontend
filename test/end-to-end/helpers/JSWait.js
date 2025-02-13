const {decodeHTML} = require('test/end-to-end/helpers/GeneralHelpers');

class JSWait extends codecept_helper {

    async _beforeStep(step) {
        if (step.name === 'waitForText') {
            // this handles decoding any HTML coded characters in the text
            step.args[0] = await decodeHTML(step.args[0].trim());
        }
    }

    async navByClick(textOrLocator, locator = null, webDriverWait = 2) {
        const helper = this.helpers.WebDriver || this.helpers.Playwright;
        const helperIsPlaywright = this.helpers.Playwright;

        if (locator) {
            locator = this.appendNotCookieBannerToSelector(locator);
        } else {
            textOrLocator = this.appendNotCookieBannerToSelector(textOrLocator);
        }

        if (typeof (textOrLocator) === 'string' &&
            (locator && (locator === 'button.govuk-button' ||
                (typeof (locator) === 'object' && locator.css.indexOf('govuk-button')) >= 0))) {
            await helper.scrollTo(locator);
            await helper.waitForEnabled(locator);
        }

        if (typeof (textOrLocator) === 'string' && textOrLocator.indexOf('.govuk-button') === -1 && textOrLocator.indexOf('#') === -1) {
            await helper.waitForText(textOrLocator);
        } else if (!locator && typeof (textOrLocator) === 'object' && textOrLocator.css.indexOf('govuk-button') >= 0) {
            await helper.scrollTo(textOrLocator);
            await helper.waitForEnabled(textOrLocator);
        }

        if (helperIsPlaywright) {

            /*const promises = [
                helper.page.waitForNavigation({
                    waitUntil: ['domcontentloaded'],
                    timeout: 600000
                }),
                helper.click(textOrLocator)
            ];*/

            const promises = [
                helper.click(textOrLocator)
            ];

            await Promise.all(promises);
            await helper.wait(webDriverWait);
            return;
        }

        // non Puppeteer
        // click and await promise

        // click by fuzzy text search - locator doesn't work for click
        // sometimes when in a scrollable div
        await helper.click(textOrLocator);
        await helper.wait(webDriverWait);
    }

    appendNotCookieBannerToSelector(locator) {
        const notCookieBanner = ':not([data-cm-action])';
        if (typeof (locator) === 'string' && locator.indexOf('govuk-button') >= 0) {
            locator += notCookieBanner;
        } else if (typeof (locator) === 'object' && locator.css.indexOf('govuk-button') >= 0) {
            locator.css += notCookieBanner;
        }
        return locator;
    }

    async amOnLoadedPage (url, language ='en') {
        let newUrl = `${url}?lng=${language}`;
        const helper = this.helpers.WebDriver || this.helpers.Playwright;
        const helperIsPlaywright = this.helpers.Playwright;

        if (newUrl.indexOf('http') !== 0) {
            newUrl = helper.options.url + newUrl;
        }

        if (helperIsPlaywright) {
            helper.page.goto(newUrl).catch(err => {
                console.error(err.message);
            });
            await helper.page.waitForNavigation({waitUntil: 'load'});

        } else {
            await helper.amOnPage(newUrl);
            await helper.waitInUrl(url);
            await helper.waitForElement('body');
        }
    }

    async enterAddress() {
        const helper = this.helpers.WebDriver || this.helpers.Playwright;
        const helperIsPlaywright = this.helpers.Playwright;
        const page = helper.page;

        if (helperIsPlaywright) {
            //await page.waitForSelector('#addressLine1', {visible: false, timeout: 5000});
            await page.click('.govuk-details__summary-text');
            await page.waitForSelector('#addressLine1', {visible: true, timeout: 5000});

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

    async checkInUrl(url, timeoutWait=60) {
        // do for both Puppeteer and Webdriver - doesn't take long
        const helper = this.helpers.WebDriver || this.helpers.Playwright;
        await helper.waitInUrl(url, timeoutWait);
    }

    async checkForText(text, timeout = null) {
        const helper = this.helpers.WebDriver || this.helpers.Playwright;
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
