import { BrowserContext, expect } from '@playwright/test';
import {BasePage, decodeHTML} from '../utility/basePage.ts';
import {getContent} from "../utility/contentHelper.ts";

export class CyaAndDeclarationSection extends BasePage {
  readonly saveAndContinueButtonLocator = this.page.getByRole('button', {name: this.commonContent.saveAndContinue});
  readonly cyaDownloadLocator = this.page.locator('#checkAnswerHref');
  readonly enLegalStatementDownloadLocator = this.page.locator('#declarationPdfHref-en');
  readonly cyLegalStatementDownloadLocator = this.page.locator('#declarationPdfHref-cy');
  readonly declarationCheckboxLocator = this.page.locator('#declarationCheckbox');

  constructor(page, context: BrowserContext, language: string) {
    super(page, context, language);
  }

  async seeSummaryPage(language, redirect) {
    const summaryContent = getContent(`app/resources/${language}/translation/summary.json`);
    await this.checkInUrl(`/summary/${redirect}`);
    await expect(this.page.getByText(await decodeHTML(summaryContent.heading))).toBeVisible();
    await expect(this.cyaDownloadLocator).toBeEnabled();
    await this.runAccessibilityTest();
    await this.downloadPdfIfNotIE11(this.cyaDownloadLocator)
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async acceptDeclaration(language = 'en', bilingualGOP = null) {
    const declarationContent = getContent(`app/resources/${language}/translation/declaration.json`);
    await this.checkInUrl('/declaration');
    if (language === 'en') {
      await expect(this.page.getByText(await decodeHTML(declarationContent.highCourtHeader))).toBeVisible();
    }
    await expect(this.enLegalStatementDownloadLocator).toBeVisible();
    await expect(this.enLegalStatementDownloadLocator).toBeEnabled();
    await this.runAccessibilityTest();

    if(bilingualGOP) {
      await expect(this.cyLegalStatementDownloadLocator).toBeVisible();
      await expect(this.cyLegalStatementDownloadLocator).toBeEnabled();
      await this.downloadPdfIfNotIE11(this.cyLegalStatementDownloadLocator);
    }

    await this.downloadPdfIfNotIE11(this.enLegalStatementDownloadLocator);
    await expect(this.declarationCheckboxLocator).toBeEnabled();
    await this.declarationCheckboxLocator.click();
    await this.declarationCheckboxLocator.check();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }
}
