'use strict';

const probateJourney = require('app/journeys/probate');
const intestacyJourney = require('app/journeys/intestacy');
const caseTypes = require('app/utils/CaseTypes');

const setJourney = (req, res, next) => {
    //req.session = caseTypes.setCaseTypeFormdata(req.session);
    req.session.journey = caseTypes.isIntestacyCaseType(req.session) ? intestacyJourney : probateJourney;
    next();
};

module.exports = setJourney;
