'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ThankYou = steps.ThankYou;

describe('ThankYou', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ThankYou.constructor.getUrl();
            expect(url).to.equal('/thankyou');
            done();
        });
    });

    describe('getContextData()', () => {
        let ctx;
        let req;

        it('should return the context with the CCD case Id when a CCD case Id exists', (done) => {
            req = {
                session: {
                    form: {
                        ccdCase: {
                            id: '1234-5678-9012-3456'
                        }
                    }
                }
            };

            ctx = ThankYou.getContextData(req);
            expect(ctx.ccdReferenceNumber).to.deep.equal('1234-5678-9012-3456');
            done();
        });
    });
});
