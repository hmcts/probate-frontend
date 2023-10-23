'use strict';
const ValidationStep = require('app/core/steps/ValidationStep');
const JourneyMap = require('../../../../core/JourneyMap');
class SubmittedToHmrcBeforeThreshold extends ValidationStep {
    static getUrl() {
        return '/submitted-to-hmrc-before-threshold';
    }
    next(req, ctx) {
        const journeyMap = new JourneyMap(req.session.journey);
        if (ctx.ihtFormEstateId === 'optionIHT400') {
            ctx.estateValueCompleted = 'optionYes';
            return journeyMap.getNextStepByName('HmrcLetter'); // Update when DTSPB-3705 is implemented
        } else if (ctx.ihtFormEstateId === 'optionIHT400421') {
            ctx.estateValueCompleted = 'optionYes';
            return journeyMap.getNextStepByName('ProbateEstateValues');
        }
        ctx.estateValueCompleted = 'optionIHT205';
        return journeyMap.getNextStepByName('IhtEstateValues');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'optionIHT400', value: 'optionIHT400', choice: 'optionIHT400'},
                {key: 'optionIHT400421', value: 'optionIHT400421', choice: 'optionIHT400421'}
            ]
        };
    }
}
module.exports = SubmittedToHmrcBeforeThreshold;
