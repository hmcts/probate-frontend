'use strict';

const ValidationStep = require('app/core/steps/ValidationStep.cjs');
const DeceasedWrapper = require('app/wrappers/Deceased.cjs');
const FormatName = require('app/utils/FormatName.cjs');
const FormatCcdCaseId = require('../../../../utils/FormatCcdCaseId.cjs');
const caseTypes = require('../../../../utils/CaseTypes');

class DeceasedAlias extends ValidationStep {

    static getUrl() {
        return '/deceased-alias';
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'alias', value: 'optionYes', choice: 'assetsInOtherNames'},
            ]
        };
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const session = req.session;
        const formdata = session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.ccdReferenceNumber = FormatCcdCaseId.format(formdata.ccdCase);
        ctx.caseType = caseTypes.getCaseType(session);
        return ctx;
    }

    isSoftStop(formdata) {
        const softStopForAssetsInAnotherName = (new DeceasedWrapper(formdata.deceased)).hasAlias();
        return {
            stepName: this.constructor.name,
            isSoftStop: softStopForAssetsInAnotherName
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;

        if (ctx.alias === 'optionNo') {
            ctx.otherNames = {};
        }

        return [ctx, formdata];
    }
}

module.exports = DeceasedAlias;
