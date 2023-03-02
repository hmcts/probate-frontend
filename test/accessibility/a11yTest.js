'use strict';

// const log = require('why-is-node-running'); // install this with yarn add to see whats causing the hang
const co = require('co');
const request = require('supertest');
const a11y = require('test/util/a11y');
const expect = require('chai').expect;
const initSteps = require('app/core/initSteps');
const {endsWith, merge} = require('lodash');
const commonContentEn = require('app/resources/en/translation/common');
const commonContentCy = require('app/resources/cy/translation/common');
const {getTestLanguages} = require('../end-to-end/helpers/GeneralHelpers');

const caseTypes = require('app/utils/CaseTypes');

const stepsToExclude = [
    'Dashboard', 'Summary', 'TaskList', 'Equality', 'PinPage', 'PinSent', 'PinResend', 'AddressLookup', 'ExecutorAddress', 'ExecutorContactDetails', 'ExecutorName',
    'ExecutorNotified', 'ExecutorNameAsOnWill', 'ExecutorApplying', 'DeleteExecutor', 'PaymentStatus', 'AddAlias', 'RemoveAlias', 'ExecutorRoles', 'ExecutorsWhenDied', 'AvayaWebchat'
];
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`], 'en');
const nock = require('nock');
const config = require('config');
const {createHttpTerminator} = require ('http-terminator');
const {gopOnlyPages, intestacyOnlyPages} = require('../../app/journeyCheck');

const commonSessionData = {
    form: {
        payloadVersion: config.payloadVersion,
        applicantEmail: 'test@email.com',
        applicant: {},
        deceased: {}
    },
    back: []
};

const warning = ['WCAG2AA.Principle1.Guideline1_3.1_3_1.H48'];
const excludeWarnings = r => {
    return !warning.includes(r.code);
};

Object.keys(steps)
    .filter(stepName => stepsToExclude.includes(stepName))
    .forEach((stepName) => delete steps[stepName]);

const runTests = (language ='en') => {

    for (const step in steps) {
        ((step) => {
            const stepUrl = step.constructor.getUrl();
            const stepUrlFirstSegment = '/' + stepUrl.split('/')[1];
            let results;
            let sessionData = {};

            if (config.whitelistedPagesAfterSubmission.includes(stepUrlFirstSegment)) {
                sessionData = merge(commonSessionData, {
                    form: {
                        declaration: {
                            declarationCheckbox: 'true'
                        },
                        payment: {
                            total: 0
                        },
                        ccdCase: {
                            state: 'CasePrinted'
                        }
                    }
                });
            } else if (config.whitelistedPagesAfterDeclaration.includes(stepUrlFirstSegment)) {
                sessionData = merge(commonSessionData, {
                    form: {
                        declaration: {
                            declarationCheckbox: 'true'
                        }
                    }
                });
            }

            if (gopOnlyPages.includes(stepUrlFirstSegment)) {
                sessionData = merge(sessionData, {
                    form: {
                        type: caseTypes.GOP
                    },
                    back: []
                });
            } else if (intestacyOnlyPages.includes(stepUrlFirstSegment)) {
                sessionData = merge(sessionData, {
                    form: {
                        type: caseTypes.INTESTACY
                    },
                    back: []
                });
            }

            describe(`Verify accessibility for the page ${step.name} - ${language}`, () => {
                let server = null;
                let agent = null;
                // eslint-disable-next-line no-unused-vars
                let httpTerminator = null;
                let title;
                const commonContent = language === 'en' ? commonContentEn : commonContentCy;

                if (step.name === 'Declaration' || step.name === 'CoApplicantDeclaration') {
                    title = `${step.content.title} - ${commonContent.serviceName}`
                        .replace(/&lsquo;/g, '‘')
                        .replace(/&rsquo;/g, '’');
                } else {
                    title = `${step.content.title} - ${commonContent.serviceName}`
                        .replace(/&lsquo;/g, '‘')
                        .replace(/&rsquo;/g, '’');
                }

                before((done) => {
                    nock(config.services.orchestrator.url)
                        .get('/invite/allAgreed/undefined')
                        .reply(200, 'false');

                    const app = require('app');
                    server = app.init(true, sessionData);
                    httpTerminator = createHttpTerminator({server: server.http});

                    agent = request.agent(server.app);
                    co(function* () {
                        let urlSuffix = '';
                        if (endsWith(agent.get(`${stepUrl}?lng=${language}`), '*')) {
                            urlSuffix = '/0';
                        }
                        results = yield a11y(agent.get(`${stepUrl}?lng=${language}`).url + urlSuffix, title);
                    })
                        .then(done, done)
                        .catch((error) => {
                            done(error);
                        });
                });

                after(function (done) {
                    nock.cleanAll();
                    server.http.close();
                    done();
                });

                it('should not generate any errors', () => {
                    const errors = results.issues.filter((res) => res.type === 'error');
                    expect(results.documentTitle).to.equal(results.documentTitle);
                    expect(errors.length).to.equal(0, JSON.stringify(errors, null, 2));
                });

                it('should not generate any warnings', () => {
                    const warnings = results.issues.filter((res) => res.type === 'warning')
                        .filter(excludeWarnings);

                    expect(warnings.length).to.equal(0, JSON.stringify(warnings, null, 2));
                });
            });
        })(steps[step]);
    }

};

getTestLanguages().forEach(language => {
    runTests(language);
});
