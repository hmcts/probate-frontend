'use strict';
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ExecutorsNames = steps.ExecutorsNames;

describe('ExecutorsNames', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ExecutorsNames.constructor.getUrl();
            expect(url).to.equal('/executors-names');
            done();
        });
    });

    describe('getContextData()', () => {
        let ctx;
        let req;

        beforeEach(() => {
            req = {
                session: {
                    form: {
                        applicant: {
                            firstName: 'Steve',
                            lastName: 'Madden'
                        }
                    }
                }
            };
        });

        it('should return the lead applicant first name and last name in the context for applicantCurrentName', (done) => {
            ctx = ExecutorsNames.getContextData(req);
            expect(ctx.applicantCurrentName).to.deep.equal('Steve Madden');
            done();
        });

        it('should return the lead applicant alias in the context for applicantCurrentName', (done) => {
            req.session.form.applicant.alias = 'Bob Alias';
            ctx = ExecutorsNames.getContextData(req);
            expect(ctx.applicantCurrentName).to.deep.equal('Bob Alias');
            done();
        });

        it('should return an empty string in the context for applicantCurrentName when no lead applicant name provided', (done) => {
            delete req.session.form.applicant;
            ctx = ExecutorsNames.getContextData(req);
            expect(ctx.applicantCurrentName).to.deep.equal('');
            done();
        });
    });
});
