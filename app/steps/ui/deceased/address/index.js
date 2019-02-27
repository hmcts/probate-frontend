'use strict';

const AddressStep = require('app/core/steps/AddressStep');
const FeatureToggle = require('app/utils/FeatureToggle');

class DeceasedAddress extends AddressStep {

    static getUrl() {
        return '/deceased-address';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        if (req.session.addresses && req.session.addresses.deceased) {
            ctx.addresses = req.session.addresses.deceased;
        }

        ctx.isDocumentUploadToggleEnabled = FeatureToggle.isEnabled(req.session.featureToggles, 'document_upload');

        return ctx;
    }

    handlePost(ctx, errors, formdata, session, hostname, featureToggles) {
        super.handlePost(ctx, errors, formdata, session, hostname, featureToggles);
        ctx.isToggleEnabled = FeatureToggle.isEnabled(featureToggles, 'screening_questions');
        if (ctx.addresses) {
            session.addresses.deceased = ctx.addresses;
        }
        ctx.isDocumentUploadToggleEnabled = FeatureToggle.isEnabled(featureToggles, 'document_upload');

        return [ctx, errors];

    nextStepOptions() {
        return {
            options: [
                {key: 'isDocumentUploadToggleEnabled', value: true, choice: 'documentUploadToggleOn'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.isDocumentUploadToggleEnabled;
        return [ctx, formdata];
    }
}

module.exports = DeceasedAddress;
