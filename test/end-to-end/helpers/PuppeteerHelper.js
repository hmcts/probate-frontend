'use strict';

const Helper = codecept_helper;
const helperName = 'Puppeteer';

class PuppeteerHelper extends Helper {

    clickBrowserBackButton() {
        const page = this.helpers[helperName].page;

        return page.goBack();
    }

    async waitForNavigationToComplete(locator) {
        const page = this.helpers[helperName].page;

        await Promise.all([
            page.waitForNavigation({waitUntil: ['domcontentloaded', 'networkidle0']}),
            page.click(locator) // Clicking the link will indirectly cause a navigation
        ]);

    }
}
module.exports = PuppeteerHelper;
