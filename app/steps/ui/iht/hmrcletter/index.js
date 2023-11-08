'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const JourneyMap = require('../../../../core/JourneyMap');

class HmrcLetter extends ValidationStep {
    static getUrl() {
        return '/hmrc-letter';
    }

    next(req, ctx) {

        const journeyMap = new JourneyMap(req.session.journey);
        if (ctx.hmrcLetterId === 'optionYes') {
            return journeyMap.getNextStepByName('UniqueProbateCode'); // add new page to add unique probabte code
        } else if (ctx.hmrcLetterId === 'optionNo') {
            return journeyMap.getNextStepByName('WaitingForHmrc');
        }

    }

}

module.exports = HmrcLetter;
