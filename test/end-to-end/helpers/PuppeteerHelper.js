'use strict';

const Helper = codecept_helper;
const helperName = 'Puppeteer';

class PuppeteerHelper extends Helper {

    clickBackBrowserButton() {

        const page = this.helpers[helperName].page;

        return page.back();
    }

}

module.exports = PuppeteerHelper;
