'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const BilingualGOP = steps.BilingualGOP;

describe('BilingualGOP', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = BilingualGOP.constructor.getUrl();
            expect(url).to.equal('/bilingual-gop');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should delete `bilingual` if null from req.session.form', (done) => {

            const req = {
                session: {
                    form: {
                        language: {
                            bilingual: null
                        }
                    }
                }
            };

            const ctx = BilingualGOP.getContextData(req);

            // undefined is not a method so cannot be called
            // eslint-disable-next-line no-unused-expressions
            expect(ctx.bilingual).to.be.undefined;

            done();
        });

        it('should not delete `bilingual` if nonnull from req.session.form', (done) => {
            const bilingualValue = {};
            const req = {
                session: {
                    form: {
                        language: {
                            bilingual: bilingualValue
                        }
                    }
                }
            };

            const ctx = BilingualGOP.getContextData(req);

            expect(ctx.bilingual).to.equal(bilingualValue, 'Strict equality expected');

            done();
        });
    });
});
