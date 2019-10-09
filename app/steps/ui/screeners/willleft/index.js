'use strict';

const EligibilityValidationStep = require('app/core/steps/EligibilityValidationStep');
const content = require('app/resources/en/translation/screeners/willleft');
const pageUrl = '/will-left';
const fieldKey = 'left';
const caseTypes = require('app/utils/CaseTypes');

class WillLeft extends EligibilityValidationStep {

    static getUrl() {
        return pageUrl;
    }

    getContextData(req, res) {
        return super.getContextData(req, res, pageUrl, fieldKey);
    }

    handlePost(ctx, errors, formdata, session) {
        const pageCaseType = (ctx.left === content.optionYes) ? caseTypes.GOP : caseTypes.INTESTACY;
        if (ctx.caseType && ctx.caseType !== pageCaseType) {
            const retainedList = ['applicantEmail', 'payloadVersion'];
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

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: content.optionYes, choice: 'withWill'}
            ]
        };
    }
}

module.exports = WillLeft;
