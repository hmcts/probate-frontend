'use strict';

const AddressStep = require('app/core/steps/AddressStep');
const FeatureToggle = require('app/utils/FeatureToggle');

class DeceasedAddress extends AddressStep {

    static getUrl() {
        return '/deceased-address';
    }

    handlePost(ctx, errors, formdata, session, hostname, featureToggles) {
        super.handlePost(ctx, errors, formdata, session, hostname, featureToggles);
        const isDocumentUploadToggleEnabled = FeatureToggle.isEnabled(featureToggles, 'document_upload');
        ctx.isScreeningQuestionsToggleEnabled = FeatureToggle.isEnabled(featureToggles, 'screening_questions');
        ctx.isDocumentUploadToggleEnabled = ctx.isScreeningQuestionsToggleEnabled && isDocumentUploadToggleEnabled;

        return [ctx, errors];
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'isDocumentUploadToggleEnabled', value: true, choice: 'documentUploadToggleOn'},
                {key: 'isScreeningQuestionsToggleEnabled', value: true, choice: 'toggleOn'},
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.isScreeningQuestionsToggleEnabled;
        delete ctx.isDocumentUploadToggleEnabled;
        return [ctx, formdata];
    }
}

module.exports = DeceasedAddress;
