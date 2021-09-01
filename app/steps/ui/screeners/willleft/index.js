'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const pageUrl = '/will-left*';
const fieldKey = 'left';
const Dashboard = require('app/steps/ui/dashboard');
const caseTypes = require('app/utils/CaseTypes');

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

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: 'optionYes', choice: 'withWill'}
            ]
        };
    }
}

module.exports = WillLeft;
