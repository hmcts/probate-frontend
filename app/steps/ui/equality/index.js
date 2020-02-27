'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const RedirectRunner = require('app/core/runners/RedirectRunner');
const config = require('app/config');
const get = require('lodash').get;

class Equality extends ValidationStep {

    runner() {
        return new RedirectRunner();
    }

    static getUrl() {
        return '/equality-and-diversity';
    }

    runnerOptions(ctx, session, host) {
        const params = {
            serviceId: 'PROBATE',
            actor: 'CITIZEN',
            pcqId: session.uuid,
            ccdCaseId: session.form.ccdCase.id,
            partyId: session.form.applicantEmail,
            returnUrl: `${host}/task-list`,
            language: session.language
        };

        const qs = Object.keys(params)
            .map(key => key + '=' + params[key])
            .join('&');

        const serviceUrl = config.services.equalityAndDiversity.url + config.services.equalityAndDiversity.path + '?' + qs;
        const options = {
            redirect: true,
            url: serviceUrl
        };

        session.form.equality = {
            equality: true
        };

        return options;
    }

    isComplete(ctx, formdata) {
        const complete = get(formdata, 'equality.equality', false) || get(formdata, 'payment.status', false) === 'Success';
        return [complete, 'inProgress'];
    }
}

module.exports = Equality;
