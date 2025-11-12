'use strict';

const router = require('express').Router();
const caseTypes = require('app/utils/CaseTypes');
const journeyCheck = require('app/middleware/journeyCheck');

const intestacyOnlyPages = [
    '/assets-outside-england-wales',
    '/value-assets-outside-england-wales',
    '/deceased-marital-status',
    '/deceased-divorce-or-separation-place',
    '/deceased-divorce-date',
    '/relationship-to-deceased',
    '/child-adopted-in',
    '/child-adoption-place',
    '/child-adopted-out',
    '/adoption-place',
    '/spouse-not-applying-reason',
    '/any-children',
    '/any-other-children',
    '/all-children-over-18',
    '/any-predeceased-children',
    '/any-surviving-grandchildren',
    '/any-grandchildren-under-18'
];

const gopOnlyPages = [
    '/will-codicils',
    '/codicils-number',
    '/deceased-married',
    '/applicant-name-as-on-will',
    '/applicant-alias',
    '/applicant-alias-reason',
    '/executors-additional-invite',
    '/executors-additional-invite-sent',
    '/check-will-executors',
    '/executors-alias',
    '/any-executors-died',
    '/other-executors-applying',
    '/executors-change-made',
    '/executor-contact-details',
    '/executor-contact-details/*',
    '/executor-id-name',
    '/executor-id-name/*',
    '/executor-name-reason',
    '/executor-name-reason/*',
    '/executors-invite',
    '/executors-invites-sent',
    '/executors-names',
    '/executor-notified',
    '/executor-notified/*',
    '/executors-named',
    '/executors-other-names',
    '/executor-roles',
    '/executor-roles/*',
    '/executors-update-invite',
    '/executors-update-invite-sent',
    '/executor-when-died',
    '/executor-when-died/*',
    '/executors-who-died'
];

gopOnlyPages.forEach(url => {
    router.get(url, (req, res, next) => journeyCheck(caseTypes.GOP, req, res, next));
});

intestacyOnlyPages.forEach(url => {
    router.get(url, (req, res, next) => journeyCheck(caseTypes.INTESTACY, req, res, next));
});

module.exports = {
    router,
    intestacyOnlyPages,
    gopOnlyPages
};
