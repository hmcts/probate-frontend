'use strict';

const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const jsonDeceasedAlias = require('app/resources/en/translation/deceased/alias');

describe('DeceasedAlias.js', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const deceasedAlias = steps.DeceasedAlias;
            const url = deceasedAlias.constructor.getUrl();
            expect(url).to.equal('/deceased-alias');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const deceasedAlias = steps.DeceasedAlias;
            const nextStepOptions = deceasedAlias.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'alias',
                    value: jsonDeceasedAlias.optionYes,
                    choice: 'assetsInOtherNames'
                }]
            });
            done();
        });
    });

    describe('getContextData()', () => {
        it('sets the ctx correctly when Yes is given', (done) => {
            const req = {
                session: {
                    form: {
                        deceased: {
                            firstName: 'First',
                            lastName: 'Last'
                        }
                    }
                }
            };

            const deceasedAlias = steps.DeceasedAlias;
            const ctx = deceasedAlias.getContextData(req);

            expect(ctx.deceasedName).to.equal('First Last');
            done();
        });
    });

    describe('action()', () => {
        it('removes the correct values from the context', (done) => {
            const ctx = {
                sessionID: 'A',
                _csrf: 'B'
            };
            const formdata = {};
            const deceasedAlias = steps.DeceasedAlias;
            const action = deceasedAlias.action(ctx, formdata);

            expect(action).to.deep.equal([{}, {}]);
            done();
        });
    });

    describe('isSoftStop()', () => {
        it('returns the correct fields when Yes is given', (done) => {
            const formdata = {
                deceased: {
                    alias: 'Yes'
                }
            };

            const deceasedAlias = steps.DeceasedAlias;
            const isSoftStop = deceasedAlias.isSoftStop(formdata);
            expect(isSoftStop.stepName).to.deep.equal('DeceasedAlias');
            expect(isSoftStop.isSoftStop).to.deep.equal(true);
            done();
        });

        it('returns the correct fields when No is given', (done) => {
            const formdata = {
                deceased: {
                    alias: 'No'
                }
            };

            const deceasedAlias = steps.DeceasedAlias;
            const isSoftStop = deceasedAlias.isSoftStop(formdata);
            expect(isSoftStop.stepName).to.deep.equal('DeceasedAlias');
            expect(isSoftStop.isSoftStop).to.deep.equal(false);
            done();
        });
    });
});
