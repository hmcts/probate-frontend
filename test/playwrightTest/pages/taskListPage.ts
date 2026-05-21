import { BrowserContext, expect } from '@playwright/test';
import {BasePage} from './utility/basePage.ts';
import {getContent} from "./utility/contentHelper.ts";

export class TaskListPage extends BasePage {
  constructor(page, context: BrowserContext, language: string) {
    super(page, context, language);
  }

  async selectATask(language ='en', taskName) {
    const taskListContent = getContent(`app/resources/${language}/translation/tasklist.json`);
    // const I = this;
    // const taskListContent = require(`app/resources/${language}/translation/tasklist`);
    const currentTaskList = taskListContent[taskName];
    await expect(this.page.getByText(taskListContent.introduction)).toBeVisible();
    await this.checkInUrl('/task-list');
    await this.navByClick(this.page.getByText(currentTaskList));
    // await I.waitForText(taskListContent.introduction, testConfig.TestWaitForTextToAppear);
    // await I.checkInUrl('/task-list');
    // await I.navByClick(currentTaskList);
  }
}
