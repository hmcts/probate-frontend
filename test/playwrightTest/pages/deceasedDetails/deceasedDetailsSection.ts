import { BrowserContext, expect } from '@playwright/test';
import {BasePage, decodeHTML} from '../utility/basePage.ts';
import {getContent} from "../utility/contentHelper.ts";
import ihtDataConfig from "../../data/ee/ihtData.json" with { type: "json" };
import applicantDetailsConfig from "../../data/intestacy/sole/applicantDetails.json" with { type: "json" };
import deceasedDetailsConfig from "../../data/deceasedDetailsConfig.json" with { type: "json" };

const optionYes = ihtDataConfig.optionYes;
const optionNo = ihtDataConfig.optionNo;

export class DeceasedDetailsSection extends BasePage {
  readonly saveAndContinueButtonLocator = this.page.getByRole('button', { name: this.commonContent.saveAndContinue });
  readonly firstNameLocator = this.page.locator('#firstName');
  readonly lastNameLocator = this.page.locator('#lastName');
  readonly dobDayLocator = this.page.locator('#dob-date-day');
  readonly dobMonthLocator = this.page.locator('#dob-date-month');
  readonly dobYearLocator = this.page.locator('#dob-date-year');
  readonly dodDayLocator = this.page.locator('#dod-date-day');
  readonly dodMonthLocator = this.page.locator('#dod-date-month');
  readonly dodYearLocator = this.page.locator('#dod-date-year');
  readonly signOutButtonLocator = this.page.getByRole('link', { name: this.commonContent.signOut });

  constructor(page, context: BrowserContext, language: string) {
    super(page, context, language);
  }

  async chooseBiLingualGrant(answer = null) {
    const otherAnswer = answer === optionYes ? optionNo : optionYes;
    await this.checkInUrl('/bilingual-gop');
    await expect(this.page.locator(`#bilingual${answer}`)).toBeEnabled();
    await expect(this.page.locator(`#bilingual${answer}`)).not.toBeChecked();
    await expect(this.page.locator(`#bilingual${otherAnswer}`)).not.toBeChecked();
    await this.page.locator(`#bilingual${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterDeceasedDetails(firstName = null, lastName = null) {
    await this.checkInUrl('/deceased-name');
    await expect(this.firstNameLocator).toBeEnabled();
    await this.firstNameLocator.fill(firstName);
    await this.lastNameLocator.fill(lastName);
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterDeceasedNameOnWill(language = 'en', answer = null) {
    const aliasContent = getContent(`app/resources/${language}/translation/deceased/nameasonwill.json`);
    await this.checkInUrl('/deceased-name-as-on-will');
    await expect(this.page.getByText(aliasContent.explanation1)).toBeVisible();
    await expect(this.page.locator(`#nameAsOnTheWill${answer}`)).toBeEnabled();
    await this.page.locator(`#nameAsOnTheWill${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterDobDetails(language, dob_day = null, dob_month = null, dob_year = null, saveAndClose = false) {
    const dobContent = getContent(`app/resources/${language}/translation/deceased/dob.json`);
    await this.checkInUrl('/deceased-dob');
    await expect(this.page.getByText(await decodeHTML(dobContent.question)
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName)))
      .toBeVisible();
    await expect(this.dobDayLocator).toBeEnabled();
    await this.dobDayLocator.fill(dob_day);
    await this.dobMonthLocator.fill(dob_month);
    await this.dobYearLocator.fill(dob_year);
    await this.runAccessibilityTest();
    if (saveAndClose) {
      await this.navByClick(this.signOutButtonLocator);
    } else {
      await this.navByClick(this.saveAndContinueButtonLocator);
    }
  }

  async enterDodDetails(dod_day = null, dod_month = null, dod_year = null) {
    await this.checkInUrl('/deceased-dod');
    await expect(this.dodDayLocator).toBeEnabled();
    await this.dodDayLocator.fill(dod_day);
    await this.dodMonthLocator.fill(dod_month);
    await this.dodYearLocator.fill(dod_year);
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterDeceasedAddress() {
    await this.checkInUrl('/deceased-address');
    await this.page.locator('#details-panel > summary > span').click();
    await expect(this.page.locator('#addressLine1')).toBeEnabled();
    await this.page.locator('#addressLine1').fill('Deceased Address Line 1');
    await this.page.locator('#addressLine2').fill('Deceased Address Line 2');
    await this.page.locator('#addressLine3').fill('Deceased Address Line 3');
    await this.page.locator('#postTown').fill('Deceased Post Town');
    await this.page.locator('#newPostCode').fill('AA1 1AA');
    await this.page.locator('#country').fill('United Kingdom');
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectDiedEngOrWales(answer = null) {
    await this.checkInUrl('/died-eng-or-wales');
    await expect(this.page.locator(`#diedEngOrWales${answer}`)).toBeEnabled();
    await this.page.locator(`#diedEngOrWales${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectDeathCertificateType(language = 'en', answer = null) {
    const deathCertificateContent = getContent(`app/resources/${language}/translation/deceased/deathCertificate.json`);
    await this.checkInUrl('/certificate-interim');
    await expect(this.page.getByText(await decodeHTML(deathCertificateContent.question))).toBeVisible();
    await expect(this.page.locator(`#deathCertificate${answer}`)).toBeEnabled();
    await this.page.locator(`#deathCertificate${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectEnglishForeignDeathCert(language = 'en', answer = null) {
    const englishForeignDeathCertContent = getContent(`app/resources/${language}/translation/deceased/englishforeigndeathcert.json`);
    await this.checkInUrl('/english-foreign-death-cert');
    await expect(this.page.getByText(await decodeHTML(englishForeignDeathCertContent.question))).toBeVisible();
    await expect(this.page.locator(`#englishForeignDeathCert${answer}`)).toBeEnabled();
    await this.page.locator(`#englishForeignDeathCert${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectForeignDeathCertTranslation(language = 'en', answer = null) {
    const foreignDeathCertTranslationContent = getContent(`app/resources/${language}/translation/deceased/foreigndeathcerttranslation.json`);
    await this.checkInUrl('/foreign-death-cert-translation');
    await expect(this.page.getByText(await decodeHTML(foreignDeathCertTranslationContent.question))).toBeVisible();
    await expect(this.page.locator(`#foreignDeathCertTranslation${answer}`)).toBeEnabled();
    await this.page.locator(`#foreignDeathCertTranslation${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectEEComplete(answer = null) {
    await this.checkInUrl('/calc-check');
    await expect(this.page.locator(`#calcCheckCompleted${answer}`)).toBeEnabled();
    await this.page.locator(`#calcCheckCompleted${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectSubmittedToHmrc(answer = null) {
    await this.checkInUrl('/new-submitted-to-hmrc');
    await expect(this.page.locator(`#estateValueCompleted${answer}`)).toBeEnabled();
    await this.page.locator(`#estateValueCompleted${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectHmrcLetterComplete(answer = null) {
    await this.checkInUrl('/hmrc-letter');
    await expect(this.page.locator(`#hmrcLetterId${answer}`)).toBeEnabled();
    await this.page.locator(`#hmrcLetterId${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterHmrcCode(hmrcCode = null) {
    await this.checkInUrl('/unique-probate-code');
    await expect(this.page.locator('#uniqueProbateCodeId')).toBeEnabled();
    await this.page.locator('#uniqueProbateCodeId').fill(hmrcCode);
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterGrossAndNet(formName = null) {
    let option;

    switch (formName) {
      case '400':
        option = '';
        break;
      case '205':
        option = '-2';
        break;
      case '421':
        option = '-3';
        break;
      default:
        option = '-2';
    }

    await this.checkInUrl('/estate-form');
    await expect(this.page.locator(`#ihtFormId${option}`)).toBeEnabled();
    await this.page.locator(`#ihtFormId${option}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterEEValue(grossValue = null, netValue = null, netQualifyingValue = null) {
    await this.checkInUrl('/iht-estate-values');
    await expect(this.page.locator('#estateGrossValueField')).toBeEnabled();
    await this.page.locator('#estateGrossValueField').fill(grossValue);
    await this.page.locator('#estateNetValueField').fill(netValue);
    await this.page.locator('#estateNetQualifyingValueField').fill(netQualifyingValue);
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectLateSpouseCivilPartner(answer = null) {
    await this.checkInUrl('/deceased-late-spouse-civil-partner');
    await expect(this.page.locator(`#deceasedHadLateSpouseOrCivilPartner${answer}`)).toBeEnabled();
    await this.page.locator(`#deceasedHadLateSpouseOrCivilPartner${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectUnusedAllowance (answer = null) {
    await this.checkInUrl('/unused-allowance-claimed');
    await expect(this.page.locator(`#unusedAllowanceClaimed${answer}`)).toBeEnabled();
    await this.page.locator(`#unusedAllowanceClaimed${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterProbateAssetValues(grossValue = null, netValue = null) {
    await this.checkInUrl('/probate-estate-values');
    await expect(this.page.locator('#grossValueField')).toBeEnabled();
    await this.page.locator('#grossValueField').fill(grossValue);
    await this.page.locator('#netValueField').fill(netValue);
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectAssetsOutsideEnglandWales(language = 'en', answer = null) {
    const assetsContent = getContent(`app/resources/${language}/translation/iht/assetsoutside.json`);
    await this.checkInUrl('/assets-outside-england-wales');
    await expect(this.page.getByText(await decodeHTML(assetsContent.hint))).toBeVisible();
    await expect(this.page.locator(`#assetsOutside${answer}`)).toBeEnabled();
    await this.page.locator(`#assetsOutside${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterValueAssetsOutsideEnglandWales(netAmount = null) {
    await this.checkInUrl('/value-assets-outside-england-wales');
    await expect(this.page.locator('#netValueAssetsOutsideField')).toBeEnabled();
    await this.page.locator('#netValueAssetsOutsideField').fill(netAmount);
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectDeceasedAlias(language = 'en', answer = null) {
    const aliasContent = getContent(`app/resources/${language}/translation/deceased/alias.json`);
    await this.checkInUrl('/deceased-alias');
    await expect(this.page.getByText(await decodeHTML(aliasContent.intestacyParagraph1
      .replace('{deceasedName}', applicantDetailsConfig.deceasedFullName))))
      .toBeVisible();
    await expect(this.page.locator(`#alias${answer}`)).toBeEnabled();
    await this.page.locator(`#alias${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectDeceasedMaritalStatus(answer = null) {
    await this.checkInUrl('/deceased-marital-status');
    await expect(this.page.locator(`#maritalStatus${answer}`)).toBeEnabled();
    await this.page.locator(`#maritalStatus${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectDivorcePlace(language = 'en', answer = null) {
    const langKey = language.charAt(0).toUpperCase() + language.slice(1);
    const divorcePlaceContent = getContent(`app/resources/${language}/translation/deceased/divorceplace.json`);
    await this.checkInUrl('/deceased-divorce-or-separation-place');
    await expect(this.page.getByText(await decodeHTML(divorcePlaceContent.question)
      .replace('{legalProcess}', deceasedDetailsConfig[`legalSeparationType${langKey}`])))
      .toBeVisible();
    await expect(this.page.locator(`#divorcePlace${answer}`)).toBeEnabled();
    await this.page.locator(`#divorcePlace${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterDivorceDate(language = 'en', answer = null, divorceDay, divorceMonth, divorceYear) {
    const langKey = language.charAt(0).toUpperCase() + language.slice(1);
    const divorceDateContent = getContent(`app/resources/${language}/translation/deceased/divorcedate.json`);
    await this.checkInUrl('/deceased-divorced-or-separation-date');
    await expect(this.page.getByText(await decodeHTML(divorceDateContent.question)
      .replace('{legalProcess}', deceasedDetailsConfig[`legalSeparationType${langKey}`])))
      .toBeVisible();
    await expect(this.page.locator(`#divorceDateKnown${answer}`)).toBeEnabled();
    await this.page.locator(`#divorceDateKnown${answer}`).click();
    await expect(this.page.locator('#divorceDate-day')).toBeVisible();
    await expect(this.page.locator('#divorceDate-day')).toBeEnabled();
    await this.page.locator('#divorceDate-day').fill(divorceDay);
    await this.page.locator('#divorceDate-month').fill(divorceMonth);
    await this.page.locator('#divorceDate-year').fill(divorceYear);
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  // GOP specific pages
  async selectDeceasedAliasGop(language = 'en', answer = null) {
    const aliasContent = getContent(`app/resources/${language}/translation/deceased/alias.json`);
    await this.checkInUrl('/deceased-alias');
    await expect(this.page.getByText(aliasContent.GopParagraph2)).toBeVisible();
    await expect(this.page.locator(`#alias${answer}`)).toBeEnabled();
    await this.page.locator(`#alias${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectDeceasedMarriedAfterDateOnWill(answer = null) {
    await this.checkInUrl('/deceased-married');
    await expect(this.page.locator(`#married${answer}`)).toBeEnabled();
    await this.page.locator(`#married${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectWillDamage(option = null, description = null) {
    await this.checkInUrl('/will-has-damage');
    await expect(this.page.locator(`#willHasVisibleDamage${option}`)).toBeEnabled();
    await this.page.locator(`#willHasVisibleDamage${option}`).click();
    if (option === '') {
      await this.page.locator('#willDamageTypes').click();
      await this.page.locator('#willDamageTypes-2').click();
      await this.page.locator('#willDamageTypes-3').click();
      await this.page.locator('#willDamageTypes-4').click();
      await this.page.locator('#willDamageTypes-5').click();
      await this.page.locator('#willDamageTypes-6').click();

      await this.page.locator('#otherDamageDescription').fill(description);
    }

    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectWillDamageReason(option = null, reason = null) {
    await this.checkInUrl('/will-damage-reason');
    await expect(this.page.locator(`#willDamageReasonKnown${option}`)).toBeEnabled();
    await this.page.locator(`#willDamageReasonKnown${option}`).click();

    if (option === '') {
      await this.page.locator('#willDamageReasonDescription').fill(reason);
    }

    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectWillDamageWho(option = null, firstName = null, lastName = null) {
    await this.checkInUrl('/will-damage-who');
    await expect(this.page.locator(`#willDamageCulpritKnown${option}`)).toBeEnabled();
    await this.page.locator(`#willDamageCulpritKnown${option}`).click();

    if (option === '') {
      await this.page.locator('#firstName').fill(firstName);
      await this.page.locator('#lastName').fill(lastName);
    }

    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectWillDamageDate(option = null, year = null) {
    await this.checkInUrl('/will-damage-date');
    await expect(this.page.locator(`#willDamageDateKnown${option}`)).toBeEnabled();
    await this.page.locator(`#willDamageDateKnown${option}`).click();

    if (option === '') {
      await this.page.locator('#willdamagedate-year').fill(year);
    }

    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectWillCodicils(option = null) {
    await this.checkInUrl('/will-codicils');
    await expect(this.page.locator(`#codicils${option}`)).toBeEnabled();
    await this.page.locator(`#codicils${option}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectWillNoOfCodicils(totalCodicils) {
    await this.checkInUrl('/codicils-number');
    await expect(this.page.locator(`#codicilsNumber`)).toBeEnabled();
    await this.page.locator(`#codicilsNumber`).fill(totalCodicils);
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectCodicilsDamage(option = null, description = null) {
    await this.checkInUrl('/codicils-have-damage');
    await expect(this.page.locator(`#codicilsHasVisibleDamage${option}`)).toBeEnabled();
    await this.page.locator(`#codicilsHasVisibleDamage${option}`).click();

    if (option === '') {
      await this.page.locator('#codicilsDamageTypes').click();
      await this.page.locator('#codicilsDamageTypes-2').click();
      await this.page.locator('#codicilsDamageTypes-3').click();
      await this.page.locator('#codicilsDamageTypes-4').click();
      await this.page.locator('#codicilsDamageTypes-5').click();
      await this.page.locator('#codicilsDamageTypes-6').click();

      await this.page.locator('#otherDamageDescription').fill(description);
    }

    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectCodicilsReason(option = null, description = null) {
    await this.checkInUrl('/codicils-damage-reason');
    await expect(this.page.locator(`#codicilsDamageReasonKnown${option}`)).toBeEnabled();
    await this.page.locator(`#codicilsDamageReasonKnown${option}`).click();

    if (option === '') {
      await this.page.locator('#codicilsDamageReasonDescription').fill(description);
    }

    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectCodicilsWho(option = null, firstName = null, lastName = null) {
    await this.checkInUrl('/codicils-damage-who');
    await expect(this.page.locator(`#codicilsDamageCulpritKnown${option}`)).toBeEnabled();
    await this.page.locator(`#codicilsDamageCulpritKnown${option}`).click();

    if (option === '') {
      await this.page.locator('#firstName').fill(firstName);
      await this.page.locator('#lastName').fill(lastName);
    }

    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectCodicilsDate(option = null, year = null) {
    await this.checkInUrl('/codicils-damage-date');
    await expect(this.page.locator(`#codicilsDamageDateKnown${option}`)).toBeEnabled();
    await this.page.locator(`#codicilsDamageDateKnown${option}`).click();

    if (option === '') {
      await this.page.locator('#codicilsdamagedate-year').fill(year);
    }

    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectWrittenWishes(option = null) {
    await this.checkInUrl('/deceased-written-wishes');
    await expect(this.page.locator(`#deceasedWrittenWishes${option}`)).toBeEnabled();
    await this.page.locator(`#deceasedWrittenWishes${option}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }
}
