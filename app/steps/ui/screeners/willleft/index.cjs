'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep.cjs');
const pageUrl = '/will-left';
const fieldKey = 'left';
const Dashboard = require('app/steps/ui/dashboard');
const caseTypes = require('app/utils/CaseTypes.cjs');

class WillLeft extends EligibilityValidationStep {

    static getUrl() {
        return pageUrl;
    }

    getContextData(req, res) {
        return super.getContextData(req, res, pageUrl, fieldKey);
    }

    handlePost(ctx, errors, formdata, session) {
        const pageCaseType = (ctx.left === 'optionYes') ? caseTypes.GOP : caseTypes.INTESTACY;
        if (ctx.caseType && ctx.caseType !== pageCaseType) {
            const retainedList = ['screeners', 'applicantEmail', 'payloadVersion', 'userLoggedIn'];
            Object.keys(formdata).forEach((key) => {
                if (!retainedList.includes(key)) {
                    delete formdata[key];
                }
            });
            formdata.deceased = {};
            formdata.applicant = {};
        }
        formdata.caseType = pageCaseType;

        return super.handlePost(ctx, errors, formdata, session);
    }

    nextStepUrl(req, ctx) {
        if (!this.previousQuestionsAnswered(req, ctx, fieldKey)) {
            return Dashboard.getUrl();
        }

        return super.nextStepUrl(req, ctx);
    }

    nextStepOptions(ctx) {
        ctx.skipDod2014 = ctx.eeDeceasedDod === 'optionYes' && ctx.left === 'optionNo';
        ctx.withWill = ctx.left === 'optionYes';
        return {
            options: [
                {key: 'skipDod2014', value: true, choice: 'skipDod2014'},
                {key: 'withWill', value: true, choice: 'withWill'},
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.skipDod2014;
        delete ctx.withWill;
        return [ctx, formdata];
    }

}

module.exports = WillLeft;
