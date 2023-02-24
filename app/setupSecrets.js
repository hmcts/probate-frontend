const config = require('config');
const {get, set} = require('lodash');
const {execSync} = require('child_process');
const logger = require('app/components/logger')('Init');

const setupSecrets = () => {
    if (config.has('secrets.probate')) {
        setSecret('secrets.probate.frontend-redis-access-key', 'redis.password');
        setSecret('secrets.probate.idam-s2s-secret', 'services.idam.service_key');
        setSecret('secrets.probate.ccidam-idam-api-secrets-probate', 'services.idam.probate_oauth2_secret');
        setSecret('secrets.probate.postcode-service-url', 'services.postcode.serviceUrl');
        setSecret('secrets.probate.postcode-service-token2', 'services.postcode.token');
        setSecret('secrets.probate.probate-survey', 'links.survey');
        setSecret('secrets.probate.probate-survey-end', 'links.surveyEndOfApplication');
        setSecret('secrets.probate.probate-service-id', 'payment.serviceId');
        setSecret('secrets.probate.probate-site-id', 'payment.siteId');
        setSecret('secrets.probate.payCaseWorkerUser', 'services.idam.probate_user_email');
        setSecret('secrets.probate.payCaseWorkerPass', 'services.idam.probate_user_password');
        setSecret('secrets.probate.AppInsightsInstrumentationKey', 'appInsights.instrumentationKey');
        setSecret('secrets.probate.launchdarkly-key', 'featureToggles.launchDarklyKey');
        setSecret('secrets.probate.launchdarklyUserkeyFrontend', 'featureToggles.launchDarklyUser.key');
        setSecret('secrets.probate.pcq-token-key', 'services.equalityAndDiversity.tokenKey');
        setSecret('secrets.probate.webchat-avaya-url', 'webchat.avayaUrl');
        setSecret('secrets.probate.webchat-avaya-client-url', 'webchat.avayaClientUrl');
        setSecret('secrets.probate.webchat-avaya-service', 'webchat.avayaService');
    }

    if (process.env.NODE_ENV === 'dev-aat') {
        setLocalSecret('idam-s2s-secret', 'services.idam.service_key');
        setLocalSecret('ccidam-idam-api-secrets-probate', 'services.idam.probate_oauth2_secret');
        setLocalSecret('launchdarkly-key', 'featureToggles.launchDarklyKey');
        setLocalSecret('launchdarklyUserkeyFrontend', 'featureToggles.launchDarklyUser.key');
        setLocalSecret('payCaseWorkerUser', 'services.idam.probate_user_email');
        setLocalSecret('payCaseWorkerPass', 'services.idam.probate_user_password');
        setLocalSecret('postcode-service-token2', 'services.postcode.token');
    }
};

const setSecret = (secretPath, configPath) => {
    if (config.has(secretPath)) {
        set(config, configPath, get(config, secretPath));
    } else {
        logger.warn('Cannot find secret with path: ' + secretPath);
    }
};

const setLocalSecret = (secretName, configPath) => {
    const result = execSync('az keyvault secret show --vault-name probate-aat -o tsv --query value --name ' + secretName);
    set(config, configPath, result.toString().replace('\n', ''));
};

module.exports = setupSecrets;
