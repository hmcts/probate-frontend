const {expect} = require('chai');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('CoApplicantAgreePage unit tests', () => {

    describe('getUrl()', () => {
        it('should return correct url', (done) => {
            const coApplicantAgreePage = steps.CoApplicantAgreePage;
            const url = coApplicantAgreePage.constructor.getUrl();
            expect(url).to.equal('/co-applicant-agree-page');
            done();
        });
    });

    describe('getContextData()', () => {
        it('sets the codicils suffix correctly when Yes is given', (done) => {
            const req = {
                session: {
                    form: {
                        applicant: {
                            firstName: 'First',
                            lastName: 'Last'
                        },
                        will: {
                            codicils: 'Yes'
                        }
                    }
                }
            };

            const formdata = req.session.form;
            const coApplicantAgreePage = steps.CoApplicantAgreePage;
            const ctx = coApplicantAgreePage.getContextData(req);

            expect(ctx.codicilsSuffix).to.equal('-codicils');
            done();
        });

        it('sets the codicils suffix correctly when Yes is given', (done) => {
            const req = {
                session: {
                    form: {
                        applicant: {
                            firstName: 'First',
                            lastName: 'Last'
                        },
                        will: {
                            codicils: 'No'
                        }
                    }
                }
            };

            const formdata = req.session.form;
            const coApplicantAgreePage = steps.CoApplicantAgreePage;
            const ctx = coApplicantAgreePage.getContextData(req);

            expect(ctx.codicilsSuffix).to.equal('');
            done();
        });
    });

    describe('action()', () => {
        it('removes the correct values from the context', (done) => {
            const ctx = {
                sessionID: 'A',
                _csrf: 'B',
                leadExecFullName: 'Full Name',
                codicilsSuffix: ''
            };
            const formdata = {};
            const coApplicantAgreePage = steps.CoApplicantAgreePage;
            const action = coApplicantAgreePage.action(ctx, formdata);

            expect(action).to.deep.equal([{}, formdata]);
            done();
        });
    });
});
