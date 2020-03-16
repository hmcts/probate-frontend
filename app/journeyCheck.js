'use strict';

const router = require('express').Router();
const config = require('config');
const caseTypes = require('app/utils/CaseTypes');
const journeyCheck = require('app/middleware/journeyCheck');

config.gopOnlyPages.forEach(url => {
    router.get(url, (req, res, next) => journeyCheck(caseTypes.GOP, req, res, next));
});

config.intestacyOnlyPages.forEach(url => {
    router.get(url, (req, res, next) => journeyCheck(caseTypes.INTESTACY, req, res, next));
});

module.exports = router;
