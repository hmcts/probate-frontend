import { BrowserContext, expect } from "@playwright/test";
import { BasePage } from "../utility/basePage.ts";
import { testConfig } from "../../configs/config.ts";
import { getContent } from '../utility/contentHelper.ts';
import { decodeHTML } from "../utility/basePage.ts";

export class IntestacyScreenerPage extends BasePage {
  readonly eligibilityLinkLocator = this.page.locator('#main-content > div.govuk-grid-row > div > h1');
  readonly cookiesLinkLocator = this.page.getByRole('link', { name: 'View cookies' });
  readonly cookiesBannerLocator = this.page.locator('#cm-cookie-banner');
  readonly analyticsYesLocator = this.page.locator('#analytics');
  readonly analyticsNoLocator = this.page.locator('#analytics-2');
  readonly apmYesLocator = this.page.locator('#apm');
  readonly apmNoLocator = this.page.locator('#apm-2');
  readonly submitButtonLocator = this.page.locator('button.govuk-button[type="submit"]');
  readonly cookiesRejectLocator = this.page.locator('button.govuk-button[data-cm-action="reject"]');
  readonly cookiesHideLocator = this.page.locator('button.govuk-button[data-cm-action="hide"]');
  readonly continueButtonLocator = this.page.getByRole('button', { name: this.commonContent.continue });
  readonly createAccountButtonLocator = this.page.getByRole('button', { name: this.commonContent.createAccount });

  constructor(page, context: BrowserContext, language: string) {
    super(page, context, language);
  }

  async clearAllCookies() {
    await this.context.clearCookies();
  }

  async startApplication(language?: string, checkCookies: boolean = false) {
    // const commonContent = getContent(language, true);
    const cookiesContent = getContent(`app/resources/${language}/translation/static/cookies.json`);
    await this.page.goto(`${testConfig.TestFrontendUrl}/start-eligibility?lng=${language}`, {
      waitUntil: 'load',
      timeout: 60000
    });
    await expect(this.eligibilityLinkLocator).toBeVisible();
    const numVisibleCookieBannerEls = await this.page.locator('#cm-cookie-banner').count();
    if (numVisibleCookieBannerEls === 1) {
      await expect(this.page.getByText(this.commonContent.cookieBannerEssentialCookies)).toBeVisible()

      if (checkCookies) {
        // nav to cookies page and switch off cookies
        await this.cookiesLinkLocator.click();
        await expect(this.page).toHaveURL(new RegExp('/cookies'));
        await expect(this.page.getByText(cookiesContent.paragraph1)).toBeVisible();
        await expect(this.cookiesBannerLocator).toBeVisible();

        // switch on ga
        await this.analyticsYesLocator.scrollIntoViewIfNeeded();
        await expect(this.analyticsYesLocator).toBeEnabled();
        await this.analyticsYesLocator.click();

        // switch off ga
        await this.analyticsNoLocator.scrollIntoViewIfNeeded();
        await expect(this.analyticsNoLocator).toBeEnabled();
        await this.analyticsNoLocator.click();

        // switch on apm
        await this.apmYesLocator.scrollIntoViewIfNeeded();
        await expect(this.apmYesLocator).toBeEnabled();
        await this.apmYesLocator.click();

        // switch off apm
        await this.apmNoLocator.scrollIntoViewIfNeeded();
        await expect(this.apmNoLocator).toBeEnabled();
        await this.apmNoLocator.click();

        // save settings
        await this.submitButtonLocator.scrollIntoViewIfNeeded();
        await expect(this.submitButtonLocator).toBeEnabled();
        await this.page.locator('button.govuk-button[type="submit"]', { hasText: cookiesContent.save }).click();

        // return to eligibility page
        await this.page.goto(`${testConfig.TestFrontendUrl}/start-eligibility?lng=${language}`);
        await expect(this.cookiesBannerLocator).not.toBeVisible();
      } else {
        // just reject additional cookies
        await expect(this.cookiesRejectLocator).toBeEnabled();
        await this.cookiesRejectLocator.click();
        await expect(this.cookiesHideLocator).toBeVisible();
        await expect(this.cookiesHideLocator).toBeEnabled();
        await this.cookiesHideLocator.click();
      }
    }

    await this.navByClick(this.continueButtonLocator);
  }

  async selectDeathCertificate(language ='en', testSurvey = false) {
    const deathCertContent = getContent(`app/resources/${language}/translation/screeners/deathcertificate.json`);
    await this.checkInUrl('/death-certificate');
    await expect(this.page.getByText(await decodeHTML(deathCertContent.question))).toBeVisible();
    await expect(this.page.locator('#deathCertificate')).toBeEnabled();

    if (testSurvey) {
      const originalTabs = this.context.pages().length;
      await this.page.locator('body > div.govuk-width-container > div > p > span > a:nth-child(1)').click();
      for (let i = 0; i <= 5; i++) {
        const currentTabs = this.context.pages().length;
        if (currentTabs > originalTabs) {
          break;
        }
        await this.page.waitForTimeout(200);
      }
      await this.switchToNextTab(1);
      await this.page.close();
    }
    await this.page.locator(`#deathCertificate`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.continueButtonLocator);
  }

  async selectDeathCertificateInEnglish(language = 'en', answer = null) {
    const deathCertificateContent = getContent(`app/resources/${language}/translation/screeners/deathcertificateinenglish.json`);
    await this.checkInUrl('/death-certificate-english');
    await expect(this.page.getByText(await decodeHTML(deathCertificateContent.question))).toBeVisible();
    await expect(this.page.locator(`#deathCertificateInEnglish${answer}`)).toBeEnabled();
    await this.page.locator(`#deathCertificateInEnglish${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.continueButtonLocator);
  }

  async selectDeathCertificateTranslation(language ='en', answer = null) {
    const commonContent = getContent(language, true);
    const deathCertTranslationContent = getContent(`app/resources/${language}/translation/screeners/deathcertificatetranslation.json`);
    await this.checkInUrl('/death-certificate-translation');
    await expect(this.page.getByText(await decodeHTML(deathCertTranslationContent.question))).toBeVisible();
    await expect(this.page.locator(`#deathCertificateTranslation${answer}`)).toBeEnabled();
    await this.page.locator(`#deathCertificateTranslation${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.page.locator('button.govuk-button', { hasText: commonContent.continue }));
  }

  async selectDeceasedDomicile(language) {
    const deceasedDomicileContent = getContent(`app/resources/${language}/translation/screeners/deceaseddomicile.json`);
    await expect(this.page.getByText(await decodeHTML(deceasedDomicileContent.question))).toBeVisible();
    await this.checkInUrl('/deceased-domicile');
    await expect(this.page.locator('#domicile')).toBeEnabled();
    await this.page.locator('#domicile').click();
    await this.runAccessibilityTest();
    await this.navByClick(this.continueButtonLocator);
  }

  async selectEEDeceasedDod(language = 'en', answer = null) {
    const eeDeceasedDodContent = getContent(`app/resources/${language}/translation/screeners/eedeceaseddod.json`);
    await this.checkInUrl('/ee-deceased-dod');
    await expect(this.page.getByText(await decodeHTML(eeDeceasedDodContent.question))).toBeVisible();
    await expect(this.page.locator(`#eeDeceasedDod${answer}`)).toBeEnabled();
    await this.page.locator(`#eeDeceasedDod${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.continueButtonLocator);

  }

  async selectEEEstateValued(language = 'en', answer = null) {
    const eeEstateValuedContent = getContent(`app/resources/${language}/translation/screeners/eeestatevalued.json`);
    await this.checkInUrl('/ee-estate-valued');
    await expect(this.page.getByText(await decodeHTML(eeEstateValuedContent.question))).toBeVisible();
    await expect(this.page.locator(`#eeEstateValued${answer}`)).toBeEnabled();
    await this.page.locator(`#eeEstateValued${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.continueButtonLocator);
  }

  async selectIhtCompleted(language ='en', answer = null) {
    const ihtCompletedContent = getContent(`app/resources/${language}/translation/screeners/ihtcompleted.json`);
    await this.checkInUrl('/iht-completed');
    await expect(this.page.getByText(await decodeHTML(ihtCompletedContent.question))).toBeVisible();
    await expect(this.page.locator(`#completed${answer}`)).toBeEnabled();
    await this.page.locator(`#completed${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.continueButtonLocator);
  }

  async selectPersonWhoDiedLeftAWill(language ='en', answer = null) {
    const willLeftContent = getContent(`app/resources/${language}/translation/screeners/willleft.json`);
    await this.checkInUrl('/will-left');
    await expect(this.page.getByText(await decodeHTML(willLeftContent.question))).toBeVisible();
    await expect(this.page.locator(`#left${answer}`)).toBeEnabled();
    await this.page.locator(`#left${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.continueButtonLocator);
  }

  async selectDiedAfterOctober2014(answer = null) {
    await this.checkInUrl('/died-after-october-2014');
    await expect(this.page.locator(`#diedAfter${answer}`)).toBeEnabled();
    await this.page.locator(`#diedAfter${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.continueButtonLocator);
  }

  async selectRelatedToDeceased(language = 'en') {
    await this.checkInUrl('/related-to-deceased');

    const heading =
      language === 'cy'
        ? /A ydych chi’n ŵr\/gwraig, yn bartner sifil neu’n blentyn yr unigolyn sydd wedi marw\?/i
        : /Are you the spouse, civil partner or child of the person who died\?/i;

    await expect(this.page.getByRole('heading', { name: heading })).toBeVisible();

    const relatedRadio = this.page.locator('input[name="related"][value="optionYes"]');
    await expect(relatedRadio).toBeEnabled();
    await relatedRadio.check();

    await this.runAccessibilityTest();
    await this.navByClick(this.continueButtonLocator);
  }



  async selectOtherApplicants(language = 'en', answer: string | null = null) {
    await this.checkInUrl('/other-applicants');

    const selectedValue =
      answer === 'optionNo' || answer === '-2'
        ? 'optionNo'
        : answer === 'optionYes' || answer === '-1'
          ? 'optionYes'
          : 'optionNo';

    const heading =
      language === 'cy'
        ? /A ydych chi’n bwriadu gwneud cais ar y cyd\?/i
        : /Are you planning to make a joint application\?/i;

    await expect(
      this.page.getByRole('heading', { name: heading })
    ).toBeVisible();

    const otherApplicantsRadio = this.page.locator(
      `input[name="otherApplicants"][value="${selectedValue}"]`
    );

    await expect(otherApplicantsRadio).toBeVisible();
    await expect(otherApplicantsRadio).toBeEnabled();
    await otherApplicantsRadio.click();
    await expect(otherApplicantsRadio).toBeChecked();

    await this.runAccessibilityTest();
    await this.navByClick(this.continueButtonLocator);
  }

  async startApply(language = 'en') {
    const applyContent = getContent(`app/resources/${language}/translation/screeners/startapply.json`);
    await this.checkInUrl('/start-apply');
    await expect(this.page.getByText(applyContent.header)).toBeVisible();
    await expect(this.createAccountButtonLocator).toBeEnabled();
    await this.runAccessibilityTest();
    await this.navByClick(this.createAccountButtonLocator);
  }
}
