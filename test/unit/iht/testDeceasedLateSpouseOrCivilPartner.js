'use strict';

const initSteps = require('app/core/initSteps');
const coreContextMockData = require('../../data/core-context-mock-data.json');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedHadLateSpouseOrCivilPartner = steps.DeceasedHadLateSpouseOrCivilPartner;

describe('DeceasedHadLateSpouseOrCivilPartner', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedHadLateSpouseOrCivilPartner.constructor.getUrl();
            expect(url).to.equal('/deceased-late-spouse-civil-partner');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with the deceased name', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {
                    language: 'en',
                    form: {
                        caseType: 'gop',
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'Pending'
                        },
                        deceased: {
                            firstName: 'Dee',
                            lastName: 'Ceased',
                        }
                    },
                    caseType: 'gop'
                }
            };
            const ctx = DeceasedHadLateSpouseOrCivilPartner.getContextData(req);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                deceasedName: 'Dee Ceased',
                sessionID: 'dummy_sessionId'
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = DeceasedHadLateSpouseOrCivilPartner.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'deceasedHadLateSpouseOrCivilPartner', value: 'optionYes', choice: 'deceasedHadLateSpouseOrCivilPartner'},
                ]
            });
            done();
        });
    });

});
