const config = require('config');
const {get, set} = require('lodash');
const logger = require('app/components/logger')('Init');

class SetupSecrets {
    setupSecrets() {
        if (config.has('secrets.probate')) {
            this.setSecret('secrets.probate.frontend-redis-access-key', 'redis.password');
            this.setSecret('secrets.probate.idam-s2s-secret', 'services.idam.service_key');
            this.setSecret('secrets.probate.ccidam-idam-api-secrets-probate', 'services.idam.probate_oauth2_secret');
            this.setSecret('secrets.probate.postcode-service-url', 'services.postcode.serviceUrl');
            this.setSecret('secrets.probate.postcode-service-token2', 'services.postcode.token');
            this.setSecret('secrets.probate.probate-survey', 'links.survey');
            this.setSecret('secrets.probate.probate-survey-end', 'links.surveyEndOfApplication');
            this.setSecret('secrets.probate.probate-service-id', 'payment.serviceId');
            this.setSecret('secrets.probate.probate-site-id', 'payment.siteId');
            this.setSecret('secrets.probate.payCaseWorkerUser', 'services.idam.probate_user_email');
            this.setSecret('secrets.probate.payCaseWorkerPass', 'services.idam.probate_user_password');
            this.setSecret('secrets.probate.AppInsightsInstrumentationKey', 'appInsights.instrumentationKey');
            this.setSecret('secrets.probate.launchdarkly-key', 'featureToggles.launchDarklyKey');
            this.setSecret('secrets.probate.launchdarklyUserkeyFrontend', 'featureToggles.launchDarklyUser.key');
            this.setSecret('secrets.probate.pcq-token-key', 'services.equalityAndDiversity.tokenKey');
            this.setSecret('secrets.probate.webchat-avaya-url', 'webchat.avayaUrl');
            this.setSecret('secrets.probate.webchat-avaya-client-url', 'webchat.avayaClientUrl');
            this.setSecret('secrets.probate.webchat-avaya-service', 'webchat.avayaService');
        }
    }

    setSecret(secretPath, configPath) {
        if (config.has(secretPath)) {
            set(config, configPath, get(config, secretPath));
        } else {
            logger.warn('Cannot find secret with path: ' + secretPath);
        }
    }
}

module.exports = SetupSecrets;
