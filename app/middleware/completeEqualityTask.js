'use strict';

const config = require('config');
const get = require('lodash').get;
const ServiceMapper = require('app/utils/ServiceMapper');
const {v4: uuidv4} = require('uuid');
const logger = require('app/components/logger')('Init');
const featureToggle = new (require('app/utils/FeatureToggle'))();
const AsyncFetch = require('app/utils/AsyncFetch');
const FormatUrl = require('app/utils/FormatUrl');

const completeEqualityTask = (params) => {
    const formData = ServiceMapper.map(
        'FormData',
        [config.services.orchestrator.url, params.req.sessionID]
    );

    if (params.isEnabled && !get(params.req.session.form, 'equality.pcqId', false)) {
        const fetchOpts = AsyncFetch.fetchOptions({}, 'GET', {});
        AsyncFetch.fetchJson(FormatUrl.format(config.services.equalityAndDiversity.url, config.endpoints.health), fetchOpts)
            .then(json => {
                const equalityHealthIsUp = json.status === 'UP' && json['pcq-backend'].status === 'UP';
                logger.info(config.services.equalityAndDiversity.name, 'is', (equalityHealthIsUp ? 'UP' : 'DOWN'));

                if (equalityHealthIsUp) {
                    params.req.session.form.equality = {
                        pcqId: uuidv4()
                    };

                    formData.post(params.req.session.authToken, params.req.session.serviceAuthorization, params.req.session.form.ccdCase.id, params.req.session.form);

                    featureToggle.callCheckToggle(params.req, params.res, params.next, params.res.locals.launchDarkly,
                        'ft_pcq_token', featureToggle.toggleFeature);

                } else {
                    pcqDown(params, formData);
                }
            });
    } else {
        pcqDown(params, formData);
    }
};

const pcqDown = (params, formData) => {
    logger.info('About to post formdata for pcqDown');
    formData.post(params.req.session.authToken, params.req.session.serviceAuthorization, params.req.session.form.ccdCase.id, params.req.session.form);

    if (params.req.session.caseType === 'intestacy') {
        params.res.redirect('/summary');
    } else {
        params.res.redirect('/task-list');
    }
};

module.exports = completeEqualityTask;
