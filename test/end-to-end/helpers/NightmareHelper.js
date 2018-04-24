/**
 * Created by doug on 24/04/18.
 */

'use strict';

const Helper = codecept_helper;

class NightmareHelper extends Helper {

    clickBackBrowserButton() {
        const browser = this.helpers['Nightmare'].browser;
        console.log('pre-browser-back');
        return browser.back();
        console.log('post-browser-back');
    }

}

module.exports = NightmareHelper;