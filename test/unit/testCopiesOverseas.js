'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('CopiesOverseas.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const copiesOverseas = steps.CopiesOverseas;
            const url = copiesOverseas.constructor.getUrl();
            expect(url).to.equal('/copies-overseas');
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
            const copiesOverseas = steps.CopiesOverseas;
            const ctx = copiesOverseas.getContextData(req);

            assert.isUndefined(ctx.overseas);
            done();
        });

        it('sets ctx correctly if value is given', (done) => {
            const req = {
                sessionId: 'A',
                session: {
                    form: {
                        copies: {
                            overseas: '2'
                        }
                    }
                }
            };
            const copiesOverseas = steps.CopiesOverseas;
            const ctx = copiesOverseas.getContextData(req);

            expect(ctx.overseas).to.deep.equal(2);
            done();
        });
    });

    describe('handlePost()', () => {
        const errors = [];

        it('should return the correct context if copies overseas', (done) => {
            const ctx = {overseas: 2};
            const copiesOverseas = steps.CopiesOverseas;
            const handlePost = copiesOverseas.handlePost(ctx, errors);
            expect(handlePost[0].overseas).to.deep.equal(2);
            done();
        });

        it('should return the correct context if no copies overseas', (done) => {
            const ctx = {};
            const copiesOverseas = steps.CopiesOverseas;
            const handlePost = copiesOverseas.handlePost(ctx, errors);
            expect(handlePost[0].overseas).to.deep.equal(0);
            done();
        });
    });

    describe('isComplete()', () => {
        it('returns true if copies overseas is greater than 0', (done) => {
            const ctx = {
                overseas: 2
            };

            const copiesOverseas = steps.CopiesOverseas;
            const isComplete = copiesOverseas.isComplete(ctx);
            expect(isComplete).to.deep.equal([true, 'inProgress']);
            done();
        });

        it('returns true if copies overseas equals 0', (done) => {
            const ctx = {
                overseas: 0
            };

            const copiesOverseas = steps.CopiesOverseas;
            const isComplete = copiesOverseas.isComplete(ctx);
            expect(isComplete).to.deep.equal([true, 'inProgress']);
            done();
        });

        it('returns false if copies overseas is less than 0', (done) => {
            const ctx = {
                overseas: -1
            };

            const copiesOverseas = steps.CopiesOverseas;
            const isComplete = copiesOverseas.isComplete(ctx);
            expect(isComplete).to.deep.equal([false, 'inProgress']);
            done();
        });
    });
});
