'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedMaritalStatus = steps.DeceasedMaritalStatus;
const content = require('app/resources/en/translation/deceased/maritalstatus');

describe('DeceasedMaritalStatus', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedMaritalStatus.constructor.getUrl();
            expect(url).to.equal('/deceased-marital-status');
            done();
        });
    });

    describe('getContextData()', () => {
        let ctx;
        let req;

        it('should return the context with the deceased name', (done) => {
            req = {
                session: {
                    form: {
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe'
                        }
                    }
                }
            };

            ctx = DeceasedMaritalStatus.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {
                maritalStatus: content.optionMarried
            };
            const nextStepOptions = DeceasedMaritalStatus.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'divorcedOrSeparated',
                    value: true,
                    choice: 'divorcedOrSeparated'
                }]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test that context variables are removed and empty object returned', () => {
            let formdata = {};
            let ctx = {
                deceasedName: 'Dee Ceased',
                divorcedOrSeparated: true
            };
            [ctx, formdata] = DeceasedMaritalStatus.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });
    });
});
