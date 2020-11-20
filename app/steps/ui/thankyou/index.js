'use strict';

const Step = require('app/core/steps/Step');
const FormatCcdCaseId = require('app/utils/FormatCcdCaseId');
const DocumentsWrapper = require('app/wrappers/Documents');
const featureToggle = require('app/utils/FeatureToggle');

class ThankYou extends Step {

    static getUrl () {
        return '/thank-you';
    }

    handleGet(ctx, formdata, featureToggles) {
        const documentsWrapper = new DocumentsWrapper(formdata);
        ctx.documentsRequired = documentsWrapper.documentsRequired(featureToggle.isEnabled(featureToggles, 'ft_new_deathcert_flow'));
        ctx.checkAnswersSummary = false;
        ctx.legalDeclaration = false;
        if (formdata.checkAnswersSummary) {
            ctx.checkAnswersSummary = true;
        }
        if (formdata.legalDeclaration) {
            ctx.legalDeclaration = true;
        }
        return [ctx];
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.ccdReferenceNumber = FormatCcdCaseId.format(req.session.form.ccdCase);
        ctx.ccdReferenceNumberAccessible = FormatCcdCaseId.formatAccessible(req.session.form.ccdCase);
        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.ccdReferenceNumber;
        delete ctx.ccdReferenceNumberAccessible;
        return [ctx, formdata];
    }
}

module.exports = ThankYou;
