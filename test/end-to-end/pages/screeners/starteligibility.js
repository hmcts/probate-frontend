'use strict';
/* eslint no-console: 0 no-unused-vars: 0 */
/* eslint-disable no-undef */
const config = require('config');

module.exports = async function(language, checkCookies = false) {
    const I = this;
    const commonContent = require(`app/resources/${language}/translation/common`);
    await I.amOnLoadedPage('/start-eligibility', language);

    const eligibilityLinkLocator = {css: '#main-content > div.govuk-form-group > a'};
    await I.waitForElement(eligibilityLinkLocator, config.TestWaitForElementToAppear);

    const numVisibleCookieBannerEls = await I.grabNumberOfVisibleElements({css: '#cm-cookie-banner'});
    if (numVisibleCookieBannerEls === 1) {
        await I.waitForText(commonContent.cookieBannerEssentialCookies);

        if (checkCookies) {
            const cookiesContent = require(`app/resources/${language}/translation/static/cookies`);

            // nav to cookies page and switch off cookies
            await I.navByClick({css: 'a[href="/cookies"]'});
            await I.checkInUrl('/cookies');
            await I.waitForText(cookiesContent.paragraph1);
            await I.seeElement('#cm-cookie-banner');

            // switch on ga
            const analyticsYesLocator = {css: '#analytics'};
            await I.scrollTo(analyticsYesLocator);
            await I.waitForEnabled(analyticsYesLocator);
            await I.click(analyticsYesLocator);

            // switch off ga
            const analyticsNoLocator = {css: '#analytics-2'};
            await I.scrollTo(analyticsNoLocator);
            await I.waitForEnabled(analyticsNoLocator);
            await I.click(analyticsNoLocator);

            // switch on apm
            const apmYesLocator = {css: '#apm'};
            await I.scrollTo(apmYesLocator);
            await I.waitForEnabled(apmYesLocator);
            await I.click(apmYesLocator);

            // switch off apm
            const apmNoLocator = {css: '#apm-2'};
            await I.scrollTo(apmNoLocator);
            await I.waitForEnabled(apmNoLocator);
            await I.click(apmNoLocator);

            // save settings
            await I.scrollTo({css: 'button.govuk-button[type="submit"]'});
            await I.click(cookiesContent.save, {css: 'button.govuk-button[type="submit"]'});

            // return to eligibility page
            await I.amOnLoadedPage('/start-eligibility', language);
            await I.dontSeeElement('#cm-cookie-banner');
        } else {
            // just reject additional cookies
            const rejectLocator = {css: 'button.govuk-button[data-cm-action="reject"]'};
            await I.waitForEnabled(rejectLocator);
            await I.click(rejectLocator);
            const hideLocator = {css: 'button.govuk-button[data-cm-action="hide"]'};
            await I.waitForVisible(hideLocator);
            await I.waitForEnabled(hideLocator);
            await I.click(hideLocator);
        }
    }

    await I.navByClick(commonContent.checkApply, {css: 'a.govuk-button'});
};
