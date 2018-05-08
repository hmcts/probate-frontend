'use strict';

const Helper = codecept_helper;
const helperName = 'Nightmare';

class NightmareHelper extends Helper {

    clickBackBrowserButton() {

        const browser = this.helpers[helperName].browser;

        return browser.back();
    }

}

module.exports = NightmareHelper;
