
'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const content = require('app/resources/en/translation/deceased/alias');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedAlias = steps.DeceasedAlias;

describe('DeceasedAlias', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedAlias.constructor.getUrl();
            expect(url).to.equal('/deceased-alias');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = DeceasedAlias.nextStepOptions();
            expect(result).to.deep.equal({
                options: [{
                    key: 'alias',
                    value: content.optionYes,
                    choice: 'assetsInOtherNames'
                }]
            });
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with the will codicils', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {
                    form: {
                        journeyType: 'probate',
                        deceased: {
                            firstName: 'Dee',
                            lastName: 'Ceased'
                        }
                    },
                    journeyType: 'probate'
                }
            };
            const ctx = DeceasedAlias.getContextData(req);
            expect(ctx).to.deep.equal({
                firstName: 'Dee',
                lastName: 'Ceased',
                deceasedName: 'Dee Ceased',
                sessionID: 'dummy_sessionId',
                journeyType: 'probate',
                featureToggles: {
                    webchat: 'false'
                }
            });
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should delete otherNames if the deceased had no aliases', (done) => {
            ctx = {
                alias: content.optionNo,
                otherNames: [
                    {
                        name_0: {firstName: 'FN1', lastName: 'LN1'},
                        name_1: {firstName: 'FN2', lastName: 'LN2'}
                    }
                ]
            };
            errors = [];
            [ctx, errors] = DeceasedAlias.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                alias: content.optionNo
            });
            done();
        });
    });

    describe('action()', () => {
        it('test that context variables are removed and empty object returned', () => {
            let formdata = {};
            let ctx = {
                deceasedName: 'Dee Ceased'
            };
            [ctx, formdata] = DeceasedAlias.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });
    });
});
