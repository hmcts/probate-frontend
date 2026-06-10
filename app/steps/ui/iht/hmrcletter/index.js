'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const ExceptedEstateDod = require('app/utils/ExceptedEstateDod');

class HmrcLetter extends ValidationStep {

    static getUrl() {
        return '/hmrc-letter';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formData = req.session.form;
        const dodDate = formData?.deceased?.['dod-date'];

        ctx.dodBeforeEeDodThreshold = ExceptedEstateDod.beforeEeDodThreshold(dodDate);
        ctx.dodAfterEeDodThreshold = ExceptedEstateDod.afterEeDodThreshold(dodDate);
        ctx.isInterimDeathCertificate = formData?.deceased?.deathCertificate === 'optionInterimCertificate';

        return ctx;
    }

    nextStepOptions(ctx) {
        ctx.noHmrcLetterBeforeEeThreshold = ctx.hmrcLetterId === 'optionNo' && ctx.dodBeforeEeDodThreshold && !ctx.isInterimDeathCertificate;
        ctx.noHmrcLetterAfterEeThreshold = ctx.hmrcLetterId === 'optionNo' && ctx.dodAfterEeDodThreshold && !ctx.isInterimDeathCertificate;

        return {
            options: [
                {key: 'hmrcLetterId', value: 'optionYes', choice: 'hmrcLetter'},
                {key: 'noHmrcLetterBeforeEeThreshold', value: true, choice: 'noHmrcLetterBeforeEeThreshold'},
                {key: 'noHmrcLetterAfterEeThreshold', value: true, choice: 'noHmrcLetterAfterEeThreshold'}
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
        return [ctx.hmrcLetterId==='optionYes' || ctx.noHmrcLetterAfterEeThreshold === true, 'inProgress'];
    }
}

module.exports = HmrcLetter;
