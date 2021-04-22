'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const coreContextMockData = require('../../data/core-context-mock-data.json');
const CodicilsNumber = steps.CodicilsNumber;

describe('CodicilsNumber', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = CodicilsNumber.constructor.getUrl();
            expect(url).to.equal('/codicils-number');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with a valid will codicils number', (done) => {
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
                    codicilsNumber: '3'
                }
            };
            const ctx = CodicilsNumber.getContextData(req);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                codicilsNumber: 3,
                sessionID: 'dummy_sessionId'
            });
            done();
        });

        it('should return the ctx with a null will codicils number', (done) => {
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
                    codicilsNumber: null
                }
            };
            const ctx = CodicilsNumber.getContextData(req);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                codicilsNumber: null,
                sessionID: 'dummy_sessionId'
            });
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should return the ctx with the will codicils number when there are codicils', (done) => {
            ctx = {
                codicilsNumber: '3'
            };
            errors = [];
            [ctx, errors] = CodicilsNumber.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                codicilsNumber: '3'
            });
            done();
        });

        it('should return the ctx with the will codicils number when there are no codicils', (done) => {
            ctx = {};
            errors = [];
            [ctx, errors] = CodicilsNumber.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                codicilsNumber: 0
            });
            done();
        });
    });
});
