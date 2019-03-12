'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const CopiesUk = steps.CopiesUk;

describe('CopiesUk', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = CopiesUk.constructor.getUrl();
            expect(url).to.equal('/copies-uk');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with a valid number of uk copies', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {
                    form: {
                        journeyType: 'probate'
                    },
                    journeyType: 'probate'
                },
                body: {
                    uk: '3'
                }
            };
            const ctx = CopiesUk.getContextData(req);
            expect(ctx).to.deep.equal({
                uk: 3,
                sessionID: 'dummy_sessionId',
                journeyType: 'probate'
            });
            done();
        });
    });

    describe('handleGet()', () => {
        it('should return true when the fees api toggle is set', (done) => {
            const ctxToTest = {};
            const formdata = {};
            const featureToggles = {
                fees_api: true
            };
            const [ctx] = CopiesUk.handleGet(ctxToTest, formdata, featureToggles);
            expect(ctx.isFeesApiToggleEnabled).to.equal(true);
            done();
        });

        it('should return false when the fees api toggle is not set', (done) => {
            const ctxToTest = {};
            const formdata = {};
            const featureToggles = {};
            const [ctx] = CopiesUk.handleGet(ctxToTest, formdata, featureToggles);
            expect(ctx.isFeesApiToggleEnabled).to.equal(false);
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should return the ctx with the number of uk copies if present', (done) => {
            ctx = {
                uk: '3'
            };
            errors = [];
            [ctx, errors] = CopiesUk.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                uk: '3'
            });
            done();
        });

        it('should return the ctx with 0 uk copies if not present', (done) => {
            ctx = {};
            errors = [];
            [ctx, errors] = CopiesUk.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                uk: 0
            });
            done();
        });
    });

    describe('isComplete()', () => {
        it('should return the completion status correcty', (done) => {
            const ctx = {
                uk: 3
            };
            const complete = CopiesUk.isComplete(ctx);
            expect(complete).to.deep.equal([true, 'inProgress']);
            done();
        });
    });

    describe('action', () => {
        it('test applicant and deceased addresses are removed from formdata', () => {
            let formdata = {
                applicant: {
                    addresses: [
                        'Address1',
                        'Address2'
                    ]
                },
                deceased: {
                    addresses: [
                        'Address1',
                        'Address2'
                    ]
                }
            };
            let ctx = {};
            [ctx, formdata] = CopiesUk.action(ctx, formdata);
            expect(formdata).to.deep.equal({
                applicant: {},
                deceased: {}
            });
        });
    });
});
