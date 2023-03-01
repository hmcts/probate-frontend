'use strict';

const router = require('express').Router();
const caseTypes = require('app/utils/CaseTypes');
const journeyCheck = require('app/middleware/journeyCheck');

const intestacyOnlyPages = [
    '/deceased-details',
    '/assets-outside-england-wales',
    '/value-assets-outside-england-wales',
    '/deceased-marital-status',
    '/deceased-divorce-or-separation-place',
    '/relationship-to-deceased',
    '/adoption-place',
    '/spouse-not-applying-reason',
    '/any-children',
    '/any-other-children',
    '/all-children-over-18',
    '/any-deceased-children',
    '/any-grandchildren-under-18'
];

const gopOnlyPages = [
    '/deceased-name',
    '/deceased-dob',
    '/deceased-dod',
    '/will-codicils',
    '/codicils-number',
    '/deceased-married',
    '/applicant-name-as-on-will',
    '/applicant-alias',
    '/applicant-alias-reason',
    '/executors-additional-invite',
    '/executors-additional-invite-sent',
    '/executor-address',
    '/executor-address/*',
    '/executors-alias',
    '/executors-all-alive',
    '/other-executors-applying',
    '/executors-change-made',
    '/executor-contact-details',
    '/executor-contact-details/*',
    '/executor-current-name',
    '/executor-current-name/*',
    '/executor-current-name-reason',
    '/executor-current-name-reason/*',
    '/executors-dealing-with-estate',
    '/executors-invite',
    '/executors-invites-sent',
    '/executors-names',
    '/executor-notified',
    '/executor-notified/*',
    '/executors-number',
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
