'use strict';

const setupSecrets = require('app/setupSecrets');
const config = require('config');
const appInsights = require('applicationinsights');

// Setup secrets before loading the app
setupSecrets();
if (config.appInsights.instrumentationKey) {
    appInsights.setup(config.appInsights.instrumentationKey)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true, true)
        .start();
    appInsights.defaultClient.trackTrace({message: 'App insights activated'});
}
const app = require('app');
app.init();
