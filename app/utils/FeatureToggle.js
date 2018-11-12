'use strict';

const services = require('app/components/services');
const featureToggles = require('app/config').featureToggles;
const logger = require('app/components/logger');

class FeatureToggle {
    callCheckToggle(req, res, next, featureToggleKey, callback, redirectPage) {
        return this.checkToggle({
            req,
            res,
            next,
            featureToggleKey,
            callback,
            redirectPage
        });
    }

    checkToggle(params) {
        const featureToggleKey = params.featureToggleKey;
        const sessionId = params.req.session.id;
        return services.featureToggle(featureToggles[featureToggleKey])
            .then(isEnabled => {
                logger(sessionId).info(`Checking feature toggle: ${featureToggleKey}, isEnabled: ${isEnabled}`);
                params.callback({
                    req: params.req,
                    res: params.res,
                    next: params.next,
                    redirectPage: params.redirectPage,
                    isEnabled: isEnabled === 'true',
                    featureToggleKey: featureToggleKey
                });
            })
            .catch(err => {
                params.next(err);
            });
    }

    togglePage(params) {
        if (params.isEnabled) {
            params.next();
        } else {
            params.res.redirect(params.redirectPage);
        }
    }

    toggleExistingPage(params) {
        if (params.isEnabled) {
            params.res.redirect(params.redirectPage);
        } else {
            params.next();
        }
    }

    toggleFeature(params) {
        if (!params.req.session.featureToggles) {
            params.req.session.featureToggles = {};
        }
        params.req.session.featureToggles[params.featureToggleKey] = params.isEnabled;
        params.next();
    }

    static isEnabled(featureToggles, key) {
        if (featureToggles && featureToggles[key]) {
            return true;
        }
        return false;
    }
}

module.exports = FeatureToggle;
