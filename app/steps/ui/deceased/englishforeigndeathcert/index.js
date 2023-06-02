'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const JourneyMap = require('app/core/JourneyMap');
const featureToggle = require('app/utils/FeatureToggle');
const ExceptedEstateDod = require('app/utils/ExceptedEstateDod');
const {isEmpty} = require('lodash');
const pageUrl = '/english-foreign-death-cert';

class EnglishForeignDeathCert extends ValidationStep {

    static getUrl() {
        return pageUrl;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formData = req.session.form;
        const ihtToggle = featureToggle.isEnabled(req.session.featureToggles, 'ft_stop_ihtonline');
        ctx.checkData = ihtToggle && (isEmpty(formData.iht) || (formData.iht.method === 'optionOnline' && isEmpty(formData.iht.identifier)));
        ctx.withPaper = ihtToggle && formData.iht && formData.iht.method === 'optionPaper';
        return ctx;
    }
    next(req, ctx) {
        const journeyMap = new JourneyMap(req.session.journey);
        const formData = req.session.form;
        if (featureToggle.isEnabled(req.session.featureToggles, 'ft_excepted_estates') && ExceptedEstateDod.afterEeDodThreshold(ctx['dod-date']) && ctx.englishForeignDeathCert === 'optionYes') {
            return journeyMap.getNextStepByName('IhtEstateValued');
        } else if (ctx.checkData && ctx.englishForeignDeathCert === 'optionYes') {
            formData.iht = {method: 'optionPaper'};
            return journeyMap.getNextStepByName('IhtPaper');
        } else if (ctx.withPaper && ctx.englishForeignDeathCert === 'optionYes') {
            return journeyMap.getNextStepByName('IhtPaper');
        }

        return journeyMap.nextStep(this, ctx);
    }

    nextStepOptions(ctx) {
        if (ctx.checkData) {
            return {
                options: [
                    {key: 'englishForeignDeathCert', value: 'optionYes', choice: 'ihtPaper'}
                ]
            };
        }
        return {
            options: [
                {key: 'englishForeignDeathCert', value: 'optionYes', choice: 'foreignDeathCertIsInEnglish'}
            ]
        };
    }
}

module.exports = EnglishForeignDeathCert;
