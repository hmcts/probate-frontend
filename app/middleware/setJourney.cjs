'use strict';

const probateJourney = require('app/journeys/probate.cjs');
const intestacyJourney = require('app/journeys/intestacy.cjs');
const caseTypes = require('app/utils/CaseTypes.cjs');

const setJourney = (req, res, next) => {
    req.session.journey = caseTypes.isIntestacyCaseType(req.session) ? intestacyJourney : probateJourney;

    next();
};

module.exports = setJourney;
