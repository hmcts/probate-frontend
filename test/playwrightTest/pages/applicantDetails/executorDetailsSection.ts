import { Page, BrowserContext, expect } from '@playwright/test';
import {BasePage} from '../utility/basePage.ts';
import { ApplicantDetailsSection } from './applicantDetailsSection.ts';
import applicantDetailsConfig from "../../data/intestacy/sole/applicantDetails.json" with { type: "json" };

export class ExecutorDetailsSection extends BasePage {
  readonly saveAndContinueButtonLocator = this.page.getByRole('button', {name: this.commonContent.saveAndContinue});
  readonly continueButtonLocator = this.page.getByRole('button', {name: this.commonContent.continue});

  private applicantDetailsPage: ApplicantDetailsSection;

  constructor(page: Page, context: BrowserContext, language: string, applicantDetailsPage: ApplicantDetailsSection) {
    super(page, context, language);
    this.applicantDetailsPage = applicantDetailsPage;
  }

  async selectNameAsOnTheWill(answer = null) {
    await this.checkInUrl('/applicant-name-as-on-will');
    await expect(this.page.locator(`#nameAsOnTheWill${answer}`)).toBeEnabled();
    await this.page.locator(`#nameAsOnTheWill${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async checkWillCodicils() {
    await this.checkInUrl('/check-will-executors');
    await this.navByClick(this.continueButtonLocator);
  }

  async enterExecutorNamed(totalExecutors = null, answer = null) {
    if (totalExecutors === 1) {
      await this.checkInUrl('/executors-named');
      await expect(this.page.locator(`#executorsNamed${answer}`)).toBeEnabled();
      await this.page.locator(`#executorsNamed${answer}`).focus();
      await this.page.locator(`#executorsNamed${answer}`).click();
      await this.page.locator(`#executorsNamed${answer}`).click();
      await this.runAccessibilityTest();
      await this.navByClick(this.saveAndContinueButtonLocator);
    } else {
      let i = 0;

      while (i < (parseInt(totalExecutors) - 1)) {
        await this.checkInUrl('/executors-named');
        await expect(this.page.locator(`#executorsNamed${answer}`)).toBeEnabled();
        await this.page.locator(`#executorsNamed${answer}`).click();
        await this.navByClick(this.saveAndContinueButtonLocator);

        await expect(this.page.locator('#executorName')).toBeEnabled();
        await this.page.locator('#executorName').fill('exec' + String.fromCharCode('A'.charCodeAt(0) + i + 2));
        await this.navByClick(this.saveAndContinueButtonLocator);
        i += 1;
      }

      await this.checkInUrl('/executors-named');
      await expect(this.page.locator('#executorsNamed-2')).toBeEnabled();
      await this.page.locator('#executorsNamed-2').click();
      await this.runAccessibilityTest();
      await this.navByClick(this.saveAndContinueButtonLocator);
    }
  }

  async selectAnyExecutorsDied(answer = null) {
    await this.checkInUrl('/any-executors-died');
    await expect(this.page.locator(`#anyExecutorsDied${answer}`)).toBeEnabled();
    await this.page.locator(`#anyExecutorsDied${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectExecutorsWhoDied(executorsWhoDiedList = null) {
    await this.checkInUrl('/executors-who-died');
    await this.page.reload();
    for (let i = 0; i < executorsWhoDiedList.length; i++) {
      const executorNumber = executorsWhoDiedList[i];
      if (executorNumber === '2') {
        await expect(this.page.locator('#executorsWhoDied')).toBeVisible();
        await expect(this.page.locator('#executorsWhoDied')).toBeEnabled();
        await this.page.locator('#executorsWhoDied').click();
      } else {
        await expect(this.page.locator(`#executorsWhoDied-${parseInt(executorNumber) - 1}`)).toBeVisible();
        await expect(this.page.locator(`#executorsWhoDied-${parseInt(executorNumber) - 1}`)).toBeEnabled();
        await this.page.locator(`#executorsWhoDied-${parseInt(executorNumber) - 1}`).click();
      }
    }
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectExecutorsWhenDied(executorNumber = null, diedBefore = null, firstRecord = null) {
    await this.checkInUrl(`/executor-when-died/${firstRecord ? '*' : parseInt(executorNumber) - 1}`);
    await this.page.reload();
    await expect(this.page.locator(`#diedbefore${diedBefore}`)).toBeEnabled();
    await this.page.locator(`#diedbefore${diedBefore}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectExecutorsDealingWithEstate(executorsApplyingList = null) {
    await this.checkInUrl('/other-executors-applying');
    for (let i = 0; i < executorsApplyingList.length; i++) {
      await expect(this.page.locator(`#executorsApplying-${parseInt(executorsApplyingList[i]) - 1}`)).toBeEnabled();
      await this.page.locator(`#executorsApplying-${parseInt(executorsApplyingList[i]) - 1}`).check();
    }

    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectExecutorsWithDifferentNameOnWill(answer = null, executorNumber) {
    await this.checkInUrl(`/executors-alias/${executorNumber}`);
    await expect(this.page.locator(`#alias${answer}`)).toBeEnabled();
    await this.page.locator(`#alias${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterExecutorContactDetails(execNumber) {
    const emailText = String((applicantDetailsConfig as unknown as Record<string, string>)[`emailAddress${execNumber}`])
    const mobileText = String((applicantDetailsConfig as unknown as Record<string, string>)[`mobileNumber${execNumber}`])
    await expect(this.page.locator('#email')).toBeEnabled();
    await this.page.locator('#email').fill(emailText);
    await this.page.locator('#mobile').fill(mobileText);
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterExecutorManualAddress(executor = null) {
    await this.checkInUrl(`/executor-address/${executor}`);
    await this.page.reload();
    await this.runAccessibilityTest();
    await this.applicantDetailsPage.enterAddressManually(true);
  }

  async selectExecutorRoles(executorNumber = null, answer = null, firstRecord = null) {
    await this.checkInUrl(`/executor-roles/${firstRecord ? '*' : parseInt(executorNumber) - 1}`);
    await this.page.reload();
    await expect(this.page.locator(`#notApplyingReason${answer}`)).toBeEnabled();
    await this.page.locator(`#notApplyingReason${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectHasExecutorBeenNotified(executorNotified = null) {
    await this.checkInUrl('/executor-notified');
    await this.page.reload();
    await expect(this.page.locator(`#executorNotified${executorNotified}`)).toBeEnabled();
    await this.page.locator(`#executorNotified${executorNotified}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }
}
