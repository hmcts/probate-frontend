'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const pageUrl = '/adopted-in';

class AdoptedIn extends ValidationStep {

    static getUrl(index = '*') {
        return `${pageUrl}/${index}`;
    }

    getContextData(req) {
        return super.getContextData(req);
    }

    isComplete(ctx) {
        return [ctx.adoptedIn === 'optionYes' || ctx.adoptedIn === 'optionNo', 'inProgress'];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        return [ctx, formdata];
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'adoptedIn', value: 'optionYes', choice: 'adoptedInYes'}
            ]
        };
    }
}

module.exports = AdoptedIn;
