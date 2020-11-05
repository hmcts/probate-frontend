'use strict';

const probateJourney = require('app/journeys/probate');
const intestacyJourney = require('app/journeys/intestacy');
const probateNewDeathCertFlow = require('app/journeys/probatenewdeathcertflow');
const intestacyNewDeathCertFlow = require('app/journeys/intestacynewdeathcertflow');
const caseTypes = require('app/utils/CaseTypes');
const featureToggle = require('app/utils/FeatureToggle');
const {get} = require('lodash');

const setJourney = (req, res, next) => {
    req.session.journey = caseTypes.isIntestacyCaseType(req.session) ? intestacyJourney : probateJourney;

    if (featureToggle.isEnabled(req.session.featureToggles, 'ft_new_deathcert_flow') &&
        !get(req.session, 'form.declaration.declarationCheckbox')) {
        req.session.journey = caseTypes.isIntestacyCaseType(req.session) ? intestacyNewDeathCertFlow : probateNewDeathCertFlow;
    }

    next();
};

module.exports = setJourney;
