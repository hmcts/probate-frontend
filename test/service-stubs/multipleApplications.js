'use strict';

const config = require('config');
const express = require('express');
const logger = require('app/components/logger');
const app = express();
const router = require('express').Router();
const ORCHESTRATOR_PORT = config.services.orchestrator.port;
const caseTypes = require('app/utils/CaseTypes');

router.get('/forms/cases', (req, res) => {
    res.status(200);
    res.send({
        applications: [
            {
                deceasedFullName: 'David Cameron',
                dateCreated: '13 July 2016',
                caseType: 'PA',
                ccdCase: {
                    id: '1234567890123456',
                    state: 'Pending'
                }
            },
            {
                deceasedFullName: 'Theresa May',
                dateCreated: '24 July 2019',
                caseType: 'PA',
                ccdCase: {
                    id: '5678901234561234',
                    state: 'CasePrinted'
                }
            },
            {
                deceasedFullName: 'Boris Johnson',
                dateCreated: '14 September 2019',
                caseType: 'PA',
                ccdCase: {
                    id: '9012345612345678',
                    state: 'Pending'
                }
            },
            {
                deceasedFullName: 'Margareth Thatcher',
                dateCreated: '2 October 2019',
                caseType: 'INTESTACY',
                ccdCase: {
                    id: '3456123456789012',
                    state: 'Pending'
                }
            },
            {
                dateCreated: '9 November 2019',
                caseType: 'PA',
                ccdCase: {
                    id: '9999999999999999',
                    state: 'Pending'
                }
            }
        ]
    });
});

router.get('/forms/case/*', (req, res) => {
    const ccdCaseId = req.originalUrl
        .split('/')[3]
        .split('?')[0];

    let formdata;

    switch (ccdCaseId) {
    case '1234567890123456':
        formdata = {
            caseType: caseTypes.GOP,
            ccdCase: {
                id: '1234567890123456',
                state: 'Pending'
            },
            executors: {},
            deceased: {
                firstName: 'David',
                lastName: 'Cameron',
                'dob-day': 9,
                'dob-month': 10,
                'dob-year': 1966,
                'dob-date': '1966-10-09T00:00:00.000Z',
                'dob-formattedDate': '9 October 1966',
                'dod-day': 13,
                'dod-month': 7,
                'dod-year': 2016,
                'dod-date': '2016-07-13T00:00:00.000Z',
                'dod-formattedDate': '13 July 2016'
            }
        };
        break;
    case '5678901234561234':
        formdata = {
            caseType: caseTypes.GOP,
            ccdCase: {
                id: '5678901234561234',
                state: 'CasePrinted'
            },
            executors: {},
        };
        break;
    case '9012345612345678':
        formdata = {
            caseType: caseTypes.GOP,
            ccdCase: {
                id: '9012345612345678',
                state: 'Pending'
            },
            executors: {},
        };
        break;
    case '3456123456789012':
        formdata = {
            caseType: caseTypes.INTESTACY,
            ccdCase: {
                id: '3456123456789012',
                state: 'Pending'
            },
            executors: {},
        };
        break;
    case '9999999999999999':
        formdata = {
            caseType: caseTypes.GOP,
            ccdCase: {
                id: '9999999999999999',
                state: 'Pending'
            },
            executors: {},
        };
        break;
    default:
        formdata = {
            executors: {},
        };
        break;
    }

    res.status(200);
    res.send(formdata);
});

router.post('/forms/newcase', (req, res) => {
    res.status(200);
    res.send({
        applications: [
            {
                deceasedFullName: 'David Cameron',
                dateCreated: '13 July 2016',
                caseType: 'PA',
                ccdCase: {
                    id: 1234567890123456,
                    state: 'Pending'
                }
            },
            {
                deceasedFullName: 'Theresa May',
                dateCreated: '24 July 2019',
                caseType: 'PA',
                ccdCase: {
                    id: 5678901234561234,
                    state: 'CasePrinted'
                }
            },
            {
                deceasedFullName: 'Boris Johnson',
                dateCreated: '31 October 2019',
                caseType: 'PA',
                ccdCase: {
                    id: 9012345612345678,
                    state: 'Pending'
                }
            },
            {
                deceasedFullName: 'Margareth Thatcher',
                dateCreated: '31 October 2019',
                caseType: 'INTESTACY',
                ccdCase: {
                    id: 3456123456789012,
                    state: 'Pending'
                }
            },
            {
                dateCreated: '13 July 2016',
                caseType: 'PA',
                ccdCase: {
                    id: 8888888888888888,
                    state: 'Pending'
                }
            }
        ]
    });
});

router.get('/invites/*', (req, res) => {
    res.status(200);
    res.send({
        invitations: [
            {
                executorName: 'Bob Jones',
                agreed: true
            },
            {
                executorName: 'Tom Smith',
                agreed: false
            },
            {
                executorName: 'James Taylor',
                agreed: null
            }
        ]
    });
});

app.use(router);

logger().info(`Listening on: ${ORCHESTRATOR_PORT}`);

const server = app.listen(ORCHESTRATOR_PORT);

module.exports = server;
