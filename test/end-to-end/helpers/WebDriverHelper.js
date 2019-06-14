'use strict';

const Helper = codecept_helper;

class WebDriverHelper extends Helper {

    clickBrowserBackButton() {
        const browser = this.helpers.WebDriverIO.browser;

        return browser.back();
    }

    isInternetExplorer() {
        return (this.helpers.WebDriverIO.config.browser === 'internet explorer');
    }

    isEdge() {
        return (this.helpers.WebDriverIO.config.browser === 'MicrosoftEdge');
    }

}
module.exports = WebDriverHelper;
