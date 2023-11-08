'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const JourneyMap = require('../../../../core/JourneyMap');

class SubmittedToHmrc extends ValidationStep {

    static getUrl() {
        return '/submitted-to-hmrc';
    }

    next(req, ctx) {
        const journeyMap = new JourneyMap(req.session.journey);
        if (ctx.ihtFormEstateId === 'optionIHT400') {
            return journeyMap.getNextStepByName('HmrcLetter'); // Added the new page called HmrcLetter which asks for whether they recived the unique code
        } else if (ctx.ihtFormEstateId === 'optionIHT400421') {
            ctx.estateValueCompleted = 'optionYes';
            return journeyMap.getNextStepByName('ProbateEstateValues');
        } else if (ctx.ihtFormEstateId === 'optionNotRequired') {
            ctx.estateValueCompleted = 'optionNotRequired';
            return journeyMap.getNextStepByName('IhtEstateValues');
        }

    }

    nextStepOptions() {
        return {
            options: [
                {key: 'optionIHT400', value: 'optionIHT400', choice: 'optionIHT400'},
                {key: 'optionIHT400421', value: 'optionIHT400421', choice: 'optionIHT400421'},
                {key: 'optionNotRequired', value: 'optionNotRequired', choice: 'optionNotRequired'}
            ]
        };
    }

}

module.exports = SubmittedToHmrc;
