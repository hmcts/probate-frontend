'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class HmrcLetter extends ValidationStep {

    static getUrl() {
        return '/hmrc-letter';
    }
    nextStepOptions() {
        return {
            options: [
                {key: 'hmrcLetterId', value: 'optionYes', choice: 'hmrcLetter'}
            ]
        };
    }

    handlePost(ctx, errors) {
        if (ctx.hmrcLetterId === 'optionNo') {
            delete ctx.uniqueProbateCodeId;
        }
        return super.handlePost(ctx, errors);
    }

    isComplete(ctx) {
        return [ctx.hmrcLetterId==='optionYes', 'inProgress'];
    }
}

module.exports = HmrcLetter;
