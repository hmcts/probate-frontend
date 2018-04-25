'use strict';

const Helper = codecept_helper;

class NightmareHelper extends Helper {

    clickBackBrowserButton() {
        const browser = this.helpers['Nightmare'].browser;

        return browser.back();
    }

}

module.exports = NightmareHelper;