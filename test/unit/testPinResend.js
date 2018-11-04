const {expect} = require('chai');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('PinResend unit tests', () => {

    describe('getUrl()', () => {
        it('should return correct url', () => {
            const PinResend = steps.PinResend;
            const url = PinResend.constructor.getUrl();
            expect(url).to.equal('/pin-resend');

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
            const PinResend = steps.PinResend;
            const testCtx = PinResend.getContextData(req);
            expect(testCtx.phoneNumber).to.equal(req.session.phoneNumber);

        });

        it('should set ctx.leadExecutorName from request', () => {
            const req = {
                session: {
                    form: {},
                    pin: '12345',
                    phoneNumber: '07448872072',
                    leadExecutorName: 'Lead Applicant',
                }
            };
            const PinResend = steps.PinResend;
            const testCtx = PinResend.getContextData(req);
            expect(testCtx.leadExecutorName).to.equal(req.session.leadExecutorName);

        });
    });
});
