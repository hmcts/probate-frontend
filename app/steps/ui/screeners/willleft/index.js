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

    handlePost(ctx, errors, formdata, session) {
        const pageCaseType = (ctx.left === content.optionYes) ? caseTypes.GOP : caseTypes.INTESTACY;
        if (ctx.caseType && ctx.caseType !== pageCaseType) {
            const retainedList = ['applicantEmail', 'payloadVersion', 'screeners'];
            Object.keys(formdata).forEach((key) => {
                if (!retainedList.includes(key)) {
                    delete formdata[key];
                }
            });
        }
        formdata.caseType = pageCaseType;

        return super.handlePost(ctx, errors, formdata, session);
    }

    nextStepOptions() {
        return {
            options: [
                {key: fieldKey, value: content.optionYes, choice: 'withWill'},
                {key: fieldKey, value: content.optionNo, choice: 'withoutWillToggleOn'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.left;
        return [ctx, formdata];
    }
}

module.exports = WillLeft;
