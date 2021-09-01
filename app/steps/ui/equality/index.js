'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const RedirectRunner = require('app/core/runners/RedirectRunner');
const config = require('config');
const get = require('lodash').get;
const createToken = require('./createToken');
const FeatureToggle = require('app/utils/FeatureToggle');

class Equality extends ValidationStep {

    runner() {
        return new RedirectRunner();
    }

    static getUrl() {
        return '/equality-and-diversity*';
    }

    // eslint-disable-next-line no-unused-vars
    runnerOptions(ctx, session, host) {
        const params = {
            serviceId: 'PROBATE',
            actor: 'APPLICANT',
            pcqId: session.form.equality.pcqId,
            ccdCaseId: session.form.ccdCase.id,
            partyId: session.form.applicantEmail,
            returnUrl: `${host}/task-list`,
            language: session.language
        };

        if (FeatureToggle.isEnabled(session.featureToggles, 'ft_pcq_token')) {
            params.token = createToken(params);
        }

        const qs = Object.keys(params)
            .map(key => key + '=' + params[key])
            .join('&');

        return {
            redirect: true,
            url: config.services.equalityAndDiversity.url + config.services.equalityAndDiversity.path + '?' + qs
        };
    }

    isComplete(ctx, formdata) {
        const complete = get(formdata, 'equality.pcqId', false) !== false || get(formdata, 'payment.status', false) === 'Success';
        return [complete, 'inProgress'];
    }
}

module.exports = Equality;
