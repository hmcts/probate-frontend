
'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const content = require('app/resources/en/translation/deceased/alias');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
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
                        caseType: 'gop',
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'Pending'
                        },
                        deceased: {
                            firstName: 'Dee',
                            lastName: 'Ceased'
                        }
                    },
                    caseType: 'gop'
                }
            };
            const ctx = DeceasedAlias.getContextData(req);
            expect(ctx).to.deep.equal({
                firstName: 'Dee',
                lastName: 'Ceased',
                deceasedName: 'Dee Ceased',
                sessionID: 'dummy_sessionId',
                caseType: 'gop',
                userLoggedIn: false,
                ccdCase: {
                    id: 1234567890123456,
                    state: 'Pending'
                }
            });
            done();
        });
    });

    describe('action()', () => {
        it('removes the correct values from the context when the deceased has an alias', (done) => {
            let formdata = {};
            let ctx = {
                alias: content.optionYes,
                deceasedName: 'Dee Ceased',
                otherNames: {
                    name_0: {firstName: 'FN1', lastName: 'LN1'},
                    name_1: {firstName: 'FN2', lastName: 'LN2'}
                }
            };
            [ctx, formdata] = DeceasedAlias.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                alias: content.optionYes,
                otherNames: {
                    name_0: {firstName: 'FN1', lastName: 'LN1'},
                    name_1: {firstName: 'FN2', lastName: 'LN2'}
                }
            });
            done();
        });

        it('removes the correct values from the context when the deceased has no alias', (done) => {
            let formdata = {};
            let ctx = {
                alias: content.optionNo,
                deceasedName: 'Dee Ceased',
                otherNames: {
                    name_0: {firstName: 'FN1', lastName: 'LN1'},
                    name_1: {firstName: 'FN2', lastName: 'LN2'}
                }
            };
            [ctx, formdata] = DeceasedAlias.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                alias: content.optionNo
            });
            done();
        });
    });
});
