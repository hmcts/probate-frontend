const {expect} = require('chai');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('PinSent unit tests', () => {

    describe('getUrl()', () => {
        it('should return correct url', () => {
            const PinSent = steps.PinSent;
            const url = PinSent.constructor.getUrl();
            expect(url).to.equal('/pin-sent');

        });
    });

    describe('getContextData()', () => {
        it('should set ctx.phoneNumber from request', () => {
            const req = {
                session: {
                    form: {},
                    pin: '12345',
                    phoneNumber: '07448872072',
                    leadExecutorName: 'Lead Applicant',
                }
            };
            const PinSent = steps.PinSent;
            const testCtx = PinSent.getContextData(req);
            expect(testCtx.phoneNumber).to.equal(req.session.phoneNumber);

        });
    });

});
