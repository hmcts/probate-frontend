import { BrowserContext, expect } from '@playwright/test';
import {BasePage} from '../utility/basePage.ts';
import {getContent} from "../utility/contentHelper.ts";

export class DeceasedDetailsSection extends BasePage {
  constructor(page, context: BrowserContext, language: string) {
    super(page, context, language);
  }
}
