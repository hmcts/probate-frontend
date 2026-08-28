import { BrowserContext, expect } from '@playwright/test';
import {BasePage} from './utility/basePage.ts';
import {getContent} from "./utility/contentHelper.ts";
import {testConfig} from '../configs/config.ts';

export class TaskListPage extends BasePage {
  constructor(page, context: BrowserContext, language: string) {
    super(page, context, language);
  }

  async selectATask(language ='en', taskName) {
    const taskListContent = getContent(`app/resources/${language}/translation/tasklist.json`);
    const currentTaskList = taskListContent[taskName];
    await expect(this.page.getByText(taskListContent.introduction)).toBeVisible();
    await this.checkInUrl('/task-list');
    await this.runAccessibilityTest();
    await this.navByClick(this.page.getByText(currentTaskList));
  }

  async chooseApplication(language ='en') {
    const dashboardContent = getContent(`app/resources/${language}/translation/dashboard.json`);
    await this.checkInUrl('/dashboard');
    await this.runAccessibilityTest();
    await expect(this.page.locator('#main-content')).toBeVisible();
    const welshLinkText = await this.page.locator('//a[@class =\'govuk-link language\']').innerText();
    console.log('Dash Board Link Name::-->' + welshLinkText);

    // we do need to allow refreshing the page here as it takes time to populate ccd, and storing data in the ccd
    // database gives a success before is actually populated, so is async.
    if (language === 'en') {
      for (let i = 0; i <= 5; i++) {
        await expect(this.page.getByRole('heading', { name: dashboardContent.header, exact: true})).toBeVisible();
        const result = await this.page.getByText(dashboardContent.statusInProgress).isVisible();
        if (result === true) {
          break;
        }
        await this.page.reload();
      }
      await expect(this.page.getByText(dashboardContent.tableHeaderDeceasedName)).toBeVisible();
      await expect(this.page.getByText(dashboardContent.tableHeaderCreateDate)).toBeVisible();
      await expect(this.page.getByText(dashboardContent.tableHeaderCaseStatus)).toBeVisible();
      await expect(this.page.getByText(dashboardContent.tableHeaderActionStatus)).toBeVisible();
      await this.navByClick(this.page.locator('a[href^="/get-case/"]'));
    } else {
      await this.page.goto(`${testConfig.TestFrontendUrl}/dashboard?lng=${language}`, {
        waitUntil: 'load',
        timeout: 60000
      });

      for (let i = 0; i <= 5; i++) {
        await expect(this.page.locator('#main-content')).toBeVisible();
        const result = await this.page.getByText(dashboardContent.statusInProgress).isVisible();
        if (result === true) {
          break;
        }
        await this.page.goto(`${testConfig.TestFrontendUrl}/dashoard?lng=${language}`, {
          waitUntil: 'load',
          timeout: 60000
        });
        await this.page.reload();
      }
      await this.navByClick(this.page.locator('a[href^="/get-case/"]'));
    }
  }
}
