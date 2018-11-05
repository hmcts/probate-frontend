'use strict';

const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('CopiesUk.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const copiesUk = steps.CopiesUk;
            const url = copiesUk.constructor.getUrl();
            expect(url).to.equal('/copies-uk');
            done();
        });
    });

    describe('getContextData()', () => {
        it('sets ctx correctly if undefined is given', (done) => {
            const req = {
                sessionId: 'A',
                session: {
                    form: {
                        copies: {}
                    }
                }
            };
            const copiesUk = steps.CopiesUk;
            const ctx = copiesUk.getContextData(req);

            expect(ctx.uk).to.deep.equal(undefined);
            done();
        });

        it('sets ctx correctly if undefined is given', (done) => {
            const req = {
                sessionId: 'A',
                session: {
                    form: {
                        copies: {
                            uk: '2'
                        }
                    }
                }
            };
            const copiesUk = steps.CopiesUk;
            const ctx = copiesUk.getContextData(req);

            expect(ctx.uk).to.deep.equal(2);
            done();
        });
    });

    describe('handlePost()', () => {
        const errors = [];

        it('should return the correct context if uk copies', (done) => {
            const ctx = {uk: 2};
            const copiesUk = steps.CopiesUk;
            const handlePost = copiesUk.handlePost(ctx, errors);
            expect(handlePost[0].uk).to.deep.equal(2);
            done();
        });

        it('should return the correct context if no uk copies', (done) => {
            const ctx = {};
            const copiesUk = steps.CopiesUk;
            const handlePost = copiesUk.handlePost(ctx, errors);
            expect(handlePost[0].uk).to.deep.equal(0);
            done();
        });
    });

    describe('isComplete()', () => {
        it('returns true if uk copies is greater than 0', (done) => {
            const ctx = {
                uk: 2
            };

            const copiesUk = steps.CopiesUk;
            const isComplete = copiesUk.isComplete(ctx);
            expect(isComplete).to.deep.equal([true, 'inProgress']);
            done();
        });

        it('returns true if uk copies equals 0', (done) => {
            const ctx = {
                uk: 0
            };

            const copiesUk = steps.CopiesUk;
            const isComplete = copiesUk.isComplete(ctx);
            expect(isComplete).to.deep.equal([true, 'inProgress']);
            done();
        });

        it('returns false if uk copies is less than 0', (done) => {
            const ctx = {
                uk: -1
            };

            const copiesUk = steps.CopiesUk;
            const isComplete = copiesUk.isComplete(ctx);
            expect(isComplete).to.deep.equal([false, 'inProgress']);
            done();
        });
    });
});
