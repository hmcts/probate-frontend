'use strict';

const services = require('app/components/services');
const featureToggles = require('app/config').featureToggles;

class FeatureToggle {
    checkToggle(params) {
        services.featureToggle(featureToggles[params.featureToggleKey]).then(isEnabled => {
            params.callback({
                req: params.req,
                res: params.res,
                next: params.next,
                redirectPage: params.redirectPage,
                isEnabled: isEnabled === 'true',
                featureToggleKey: params.featureToggleKey
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
