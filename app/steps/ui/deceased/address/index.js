'use strict';

const AddressStep = require('app/core/steps/AddressStep');
const FeatureToggle = require('app/utils/FeatureToggle');

class DeceasedAddress extends AddressStep {

    static getUrl() {
        return '/deceased-address';
    }

    getContextData(req) {
        const ctx =super.getContextData(req);
        if (req.session.addresses && req.session.addresses.deceased) {
            ctx.addresses = req.session.addresses.deceased;
        }
        return ctx;

    }

    handlePost(ctx, errors, formdata, session, hostname, featureToggles) {
        super.handlePost(ctx, errors, formdata, session, hostname, featureToggles);
        ctx.isToggleEnabled = FeatureToggle.isEnabled(featureToggles, 'screening_questions');
        if (ctx.addresses) {
            session.addresses.deceased = ctx.addresses;
        }
        return [ctx, errors];
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'isToggleEnabled', value: true, choice: 'toggleOn'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.isToggleEnabled;
        return [ctx, formdata];
    }
}

module.exports = DeceasedAddress;
