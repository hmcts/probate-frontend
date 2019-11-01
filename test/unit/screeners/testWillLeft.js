'use strict';

const journey = require('app/journeys/probate');
const initSteps = require('../../../app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const WillLeft = steps.WillLeft;
const content = require('app/resources/en/translation/screeners/willleft');

describe('WillLeft', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = WillLeft.constructor.getUrl();
            expect(url).to.equal('/will-left');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the correct context on GET', (done) => {
            const req = {
                method: 'GET',
                sessionID: 'dummy_sessionId',
                session: {
                    form: {
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'Pending'
                        }
                    },
                    caseType: 'gop'
                },
                body: {
                    left: content.optionYes
                }
            };
            const res = {};

            const ctx = WillLeft.getContextData(req, res);
            expect(ctx).to.deep.equal({
                sessionID: 'dummy_sessionId',
                left: content.optionYes,
                caseType: 'gop',
                userLoggedIn: false,
                ccdCase: {
                    id: 1234567890123456,
                    state: 'Pending'
                }
            });
            done();
        });
    });

    describe('handlePost()', () => {
        it('should set session.form.caseType', (done) => {
            const ctxToTest = {
                left: content.optionYes
            };
            const errorsToTest = {};
            const formdata = {
            };
            const session = {
                form: {}
            };
            const [ctx, errors] = WillLeft.handlePost(ctxToTest, errorsToTest, formdata, session);
            expect(ctx).to.deep.equal({
                left: content.optionYes
            });
            expect(errors).to.deep.equal({});
            done();
        });

        it('should clear session.form except for retainedList on change of caseType', (done) => {
            const ctxToTest = {
                left: content.optionYes,
                caseType: 'Intestacy'
            };
            const errorsToTest = {};
            const formdata = {
                key: 'value',
                key2: 'value',
                applicantEmail: 'test@email.com',
                payloadVersion: '1.0.1',
                userLoggedIn: true,
                screeners: {
                    deathCertificate: 'Yes',
                    domicile: 'Yes',
                    completed: 'Yes'
                }
            };
            const session = {};
            session.form = formdata;

            const [ctx, errors] = WillLeft.handlePost(ctxToTest, errorsToTest, formdata, session);
            expect(errors).to.deep.equal({});
            expect(ctx).to.deep.equal({
                caseType: 'Intestacy',
                left: 'Yes'
            });
            expect(formdata).to.deep.equal({
                applicantEmail: 'test@email.com',
                caseType: 'gop',
                payloadVersion: '1.0.1',
                applicant: {},
                deceased: {},
                userLoggedIn: true,
                screeners: {
                    deathCertificate: 'Yes',
                    domicile: 'Yes',
                    completed: 'Yes'
                }
            });
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const req = {
                session: {
                    journey: journey,
                    form: {
                        screeners: {
                            deathCertificate: 'Yes',
                            domicile: 'Yes',
                            completed: 'Yes'
                        }
                    }
                }
            };
            const ctx = {
                left: content.optionYes
            };
            const nextStepUrl = WillLeft.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/will-original');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const req = {
                session: {
                    journey: journey,
                    form: {
                        screeners: {
                            deathCertificate: 'Yes',
                            domicile: 'Yes',
                            completed: 'Yes'
                        }
                    }
                }
            };
            const ctx = {
                left: content.optionNo
            };
            const nextStepUrl = WillLeft.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/died-after-october-2014');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = WillLeft.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {
                        key: 'left',
                        value: content.optionYes,
                        choice: 'withWill'
                    }
                ]
            });
            done();
        });
    });
});
