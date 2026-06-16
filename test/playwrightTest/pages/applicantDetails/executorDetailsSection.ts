import { BrowserContext, expect } from '@playwright/test';
import {BasePage} from '../utility/basePage';

export class ExecutorDetailsSection extends BasePage {
  readonly saveAndContinueButtonLocator = this.page.getByRole('button', {name: this.commonContent.saveAndContinue});
  readonly continueButtonLocator = this.page.getByRole('button', {name: this.commonContent.continue});

  constructor(page, context: BrowserContext, language: string) {
    super(page, context, language);
  }

  async selectNameAsOnTheWill(answer = null) {
    await this.checkInUrl('/applicant-name-as-on-will');
    await expect(this.page.locator(`#nameAsOnTheWill${answer}`)).toBeEnabled();
    await this.page.locator(`#nameAsOnTheWill${answer}`).click();
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
      await this.page.locator(`#executorsNamed${answer}`).click();
      await this.navByClick(this.saveAndContinueButtonLocator);
    } else {
      let i = 0;

      while (i < (parseInt(totalExecutors) - 1)) {
        // eslint-disable-next-line no-await-in-loop
        await this.checkInUrl('/executors-named');
        // eslint-disable-next-line no-await-in-loop
        await expect(this.page.locator(`#executorsNamed${answer}`)).toBeEnabled();
        // eslint-disable-next-line no-await-in-loop
        await this.page.locator(`#executorsNamed${answer}`).click();
        // eslint-disable-next-line no-await-in-loop
        await this.navByClick(this.saveAndContinueButtonLocator);

        // eslint-disable-next-line no-await-in-loop
        await expect(this.page.locator('#executorName')).toBeEnabled();
        // eslint-disable-next-line no-await-in-loop
        await this.page.locator('#executorName').fill('exec' + String.fromCharCode('A'.charCodeAt(0) + i + 2));
        // eslint-disable-next-line no-await-in-loop
        await this.navByClick(this.saveAndContinueButtonLocator);
        i += 1;
      }

      await this.checkInUrl('/executors-named');
      await expect(this.page.locator('#executorsNamed-2')).toBeEnabled();
      await this.page.locator('#executorsNamed-2').click();
      await this.navByClick(this.saveAndContinueButtonLocator);
    }
  }
}
