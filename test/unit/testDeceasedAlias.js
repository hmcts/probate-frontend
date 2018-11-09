'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const jsonDeceasedAlias = require('app/resources/en/translation/deceased/alias');

describe('DeceasedAlias', () => {
    const deceasedAlias = steps.DeceasedAlias;

    describe('getUrl', () => {
        it('should return the correct url', (done) => {
            const url = deceasedAlias.constructor.getUrl();
            expect(url).to.equal('/deceased-alias');
            done();
        });
    });

    describe('nextStepOptions', () => {
        it('should return the correct options', (done) => {
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

    describe('getContextData', () => {
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

            const ctx = deceasedAlias.getContextData(req);

            expect(ctx.deceasedName).to.equal('First Last');
            done();
        });
    });

    describe('handlePost', () => {
        it('deletes otherNames if alias is "No"', () => {
            const ctxToTest = {
                alias: 'No',
                otherNames: {
                    name_0: {firstName: 'new_died_firstname', lastName: 'new_died_lastname'}
                },
            };
            const [ctx] = deceasedAlias.handlePost(ctxToTest);
            assert.isUndefined(ctx.otherNames);
        });

        it('does not delete otherNames if hasAlias is "Yes"', () => {
            const ctxToTest = {
                alias: 'Yes',
                otherNames: {
                    name_0: {firstName: 'new_died_firstname', lastName: 'new_died_lastname'}
                },
            };
            const [ctx] = deceasedAlias.handlePost(ctxToTest);
            expect(ctx.otherNames).to.equal(ctxToTest.otherNames);
        });
    });

    describe('isSoftStop', () => {
        it('returns the correct fields when Yes is given', (done) => {
            const formdata = {
                deceased: {
                    alias: 'Yes'
                }
            };

            const isSoftStop = deceasedAlias.isSoftStop(formdata);
            expect(isSoftStop.stepName).to.equal('DeceasedAlias');
            expect(isSoftStop.isSoftStop).to.equal(true);
            done();
        });

        it('returns the correct fields when No is given', (done) => {
            const formdata = {
                deceased: {
                    alias: 'No'
                }
            };

            const isSoftStop = deceasedAlias.isSoftStop(formdata);
            expect(isSoftStop.stepName).to.equal('DeceasedAlias');
            expect(isSoftStop.isSoftStop).to.equal(false);
            done();
        });
    });
});
