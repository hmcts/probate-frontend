'use strict';

const config = require('app/config');
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
                    id: 1234567890123456,
                    state: 'Draft'
                }
            },
            {
                deceasedFullName: 'Theresa May',
                dateCreated: '24 July 2019',
                caseType: 'PA',
                ccdCase: {
                    id: 5678901234561234,
                    state: 'CaseCreated'
                }
            },
            {
                deceasedFullName: 'Boris Johnson',
                dateCreated: '31 October 2019',
                caseType: 'PA',
                ccdCase: {
                    id: 9012345612345678,
                    state: 'Draft'
                }
            },
            {
                deceasedFullName: 'Margareth Thatcher',
                dateCreated: '31 October 2019',
                caseType: 'INTESTACY',
                ccdCase: {
                    id: 3456123456789012,
                    state: 'Draft'
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
                id: 1234567890123456,
                state: 'Draft'
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
                id: 5678901234561234,
                state: 'CaseCreated'
            },
            executors: {},
        };
        break;
    case '9012345612345678':
        formdata = {
            caseType: caseTypes.GOP,
            ccdCase: {
                id: 9012345612345678,
                state: 'Draft'
            },
            executors: {},
        };
        break;
    case '3456123456789012':
        formdata = {
            caseType: caseTypes.INTESTACY,
            ccdCase: {
                id: 3456123456789012,
                state: 'Draft'
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
                    state: 'Draft'
                }
            },
            {
                deceasedFullName: 'Theresa May',
                dateCreated: '24 July 2019',
                caseType: 'PA',
                ccdCase: {
                    id: 5678901234561234,
                    state: 'CaseCreated'
                }
            },
            {
                deceasedFullName: 'Boris Johnson',
                dateCreated: '31 October 2019',
                caseType: 'PA',
                ccdCase: {
                    id: 9012345612345678,
                    state: 'Draft'
                }
            },
            {
                deceasedFullName: 'Margareth Thatcher',
                dateCreated: '31 October 2019',
                caseType: 'INTESTACY',
                ccdCase: {
                    id: 3456123456789012,
                    state: 'Draft'
                }
            },
            {
                dateCreated: '13 July 2016',
                caseType: 'PA',
                ccdCase: {
                    id: 3456123456789012,
                    state: 'Draft'
                }
            }
        ]
    });
});

router.get('/invites/*', (req, res) => {
    res.status(200);
    res.send([
        {
            executorName: 'Bob Jones',
            agreed: true
        },
        {
            executorName: 'Tom Smith',
            agreed: false
        }
    ]);
});

app.use(router);

logger().info(`Listening on: ${ORCHESTRATOR_PORT}`);

const server = app.listen(ORCHESTRATOR_PORT);

module.exports = server;
