'use strict';

const config = require('config');
const caseTypes = require('app/utils/CaseTypes.cjs');
const LaunchDarkly = require('app/components/launch-darkly');

class FeatureToggle {
    constructor() {
        this.launchDarkly = new LaunchDarkly().getInstance();
    }

    callCheckToggle(req, res, next, launchDarkly, featureToggleKey, callback, redirectPage) {
        return this.checkToggle({
            req,
            res,
            next,
            launchDarkly,
            featureToggleKey,
            callback,
            redirectPage
        });
    }

    checkToggle(params) {
        const featureToggleKey = config.featureToggles[params.featureToggleKey];
        const ldUser = config.featureToggles.launchDarklyUser;

        let ldDefaultValue = false;

        if (params.launchDarkly.ftValue && params.launchDarkly.ftValue[params.featureToggleKey]) {
            ldDefaultValue = params.launchDarkly.ftValue[params.featureToggleKey];
        }

        try {
            this.launchDarkly.variation(featureToggleKey, ldUser, ldDefaultValue, (err, showFeature) => {
                if (err) {
                    params.next();
                } else {
                    params.callback({
                        req: params.req,
                        res: params.res,
                        next: params.next,
                        redirectPage: params.redirectPage,
                        isEnabled: showFeature,
                        featureToggleKey: params.featureToggleKey
                    });
                }
            });
        } catch (err) {
            params.next();
        }
    }

    togglePage(params) {
        if (params.isEnabled) {
            params.next();
        } else if (typeof params.redirectPage === 'string') {
            params.res.redirect(params.redirectPage);
        } else if (typeof params.redirectPage === 'object' && params.req.session.form.type === caseTypes.GOP) {
            params.res.redirect(params.redirectPage.gop);
        } else if (typeof params.redirectPage === 'object' && params.req.session.form.type === caseTypes.INTESTACY) {
            params.res.redirect(params.redirectPage.intestacy);
        }
    }

    toggleExistingPage(params) {
        if (params.isEnabled && typeof params.redirectPage === 'string') {
            params.res.redirect(params.redirectPage);
        } else if (params.isEnabled && typeof params.redirectPage === 'object' && params.req.session.form.type === caseTypes.GOP) {
            params.res.redirect(params.redirectPage.gop);
        } else if (params.isEnabled && typeof params.redirectPage === 'object' && params.req.session.form.type === caseTypes.INTESTACY) {
            params.res.redirect(params.redirectPage.intestacy);
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

    static appwideToggles(req, ctx, appwideToggles) {
        if (appwideToggles.length) {
            ctx.featureToggles = {};
            appwideToggles.forEach((toggleKey) => {
                ctx.featureToggles[toggleKey] = FeatureToggle.isEnabled(req.session.featureToggles, toggleKey).toString();
            });
        }

        return ctx;
    }

    static isEnabled(featureToggles, key) {
        if (featureToggles && featureToggles[key]) {
            return true;
        }
        return false;
    }
}

module.exports = FeatureToggle;
