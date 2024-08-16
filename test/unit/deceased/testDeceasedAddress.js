'use strict';

const initSteps = require('app/core/initSteps');
const coreContextMockData = require('../../data/core-context-mock-data.json');
const journeyProbate = require('../../../app/journeys/probate');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedAddress = steps.DeceasedAddress;
const PreviousStep = steps.DeceasedDod;

describe('DeceasedAddress', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedAddress.constructor.getUrl();
            expect(url).to.equal('/deceased-address');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with the deceased address', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {
                    language: 'en',
                    form: {
                        caseType: 'gop',
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'Pending'
                        }
                    },
                    caseType: 'gop'
                },
                body: {
                    addressLine1: '143 Caerfai Bay Road',
                    postTown: 'town',
                    newPostCode: 'L23 6WW',
                    country: 'United Kingdon',
                    postcode: 'L23 6WW'
                }
            };
            const ctx = DeceasedAddress.getContextData(req);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                addressLine1: '143 Caerfai Bay Road',
                postTown: 'town',
                country: 'United Kingdon',
                newPostCode: 'L23 6WW',
                postcode: 'L23 6WW',
                sessionID: 'dummy_sessionId',
                caseType: 'gop',
                userLoggedIn: false
            });
            done();
        });
    });

    describe('previousStepUrl()', () => {
        let ctx;
        it('should return the previous step url', (done) => {
            const res = {
                redirect: (url) => url
            };
            const req = {
                session: {
                    language: 'en',
                    form: {
                        language: {
                            bilingual: 'optionYes'
                        },
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe',
                            'dob-day': '02',
                            'dob-month': '03',
                            'dob-year': '2002',
                            'dod-day': '02',
                            'dod-month': '03',
                            'dod-year': '2003',
                            nameAsOnTheWill: 'Yes'
                        }
                    }
                }
            };
            req.session.journey = journeyProbate;
            ctx = {};
            DeceasedAddress.previousStepUrl(req, res, ctx);
            expect(ctx.previousUrl).to.equal(PreviousStep.constructor.getUrl());
            done();
        });
    });
});
