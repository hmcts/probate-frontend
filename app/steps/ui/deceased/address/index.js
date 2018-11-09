'use strict';

const AddressStep = require('app/core/steps/AddressStep');
const FeatureToggle = require('app/utils/FeatureToggle');

class DeceasedAddress extends AddressStep {

    static getUrl() {
        return '/deceased-address';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.isToggleEnabled = FeatureToggle.isEnabled(req.session.featureToggles, 'screening_questions');
        return ctx;
    }

    handlePost(ctx, errors, formdata, session, hostname, featureToggles) {
        super.handlePost(ctx, errors, formdata, session, hostname, featureToggles);
        const isDocumentUploadToggleEnabled = FeatureToggle.isEnabled(featureToggles, 'document_upload');
        ctx.isDocumentUploadToggleEnabled = ctx.isToggleEnabled && isDocumentUploadToggleEnabled;

        return [ctx, errors];
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'isDocumentUploadToggleEnabled', value: true, choice: 'documentUploadToggleOn'},
                {key: 'isToggleEnabled', value: true, choice: 'toggleOn'},
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.isToggleEnabled;
        delete ctx.isDocumentUploadToggleEnabled;
        return [ctx, formdata];
    }
}

module.exports = DeceasedAddress;
