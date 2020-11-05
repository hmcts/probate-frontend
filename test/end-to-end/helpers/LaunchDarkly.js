'use strict';

const testConfig = require('test/config');
const launchDarkly = require('launchdarkly-node-server-sdk');

class LaunchDarkly {
    constructor() {
        this.ready = false;
        const options = testConfig.featureToggles.enabled ? {diagnosticOptOut: true} : {offline: true};
        this.client = launchDarkly.init(testConfig.featureToggles.launchDarklyKey, options);
    }

    async variation(...params) {
        await this.client.waitForInitialization();
        return this.client.variation(...params);
    }

    close() {
        this.client.close();
    }
}

module.exports = LaunchDarkly;
