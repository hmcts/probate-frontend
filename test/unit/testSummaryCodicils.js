'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');

describe('Summary - Codicils', () => {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const baseReq = {
        sessionID: 'dummy_sessionId',
        session: {
            language: 'en',
            form: {
                ccdCase: {
                    id: 1234567890123456,
                    state: 'Pending'
                },
                caseType: 'gop',
                deceased: {
                    firstName: 'Dee',
                    lastName: 'Ceased',
                    'dod-date': '2022-02-02',
                    'dod-formattedDate': '2 February 2022',
                    aliasFirstNameOnWill: 'firstNameOnWill',
                    aliasLastNameOnWill: 'lastNameOnWill'
                },
                iht: {
                    netValue: 300000
                },
                will: {},
            }
        },
        authToken: '1234'
    };

    describe('getContextData()', () => {
        it('[PROBATE] return the correct properties in ctx when codicils not present', (done) => {
            const req = baseReq;
            req.session.form.will.codicils = 'optionNo';

            const Summary = steps.Summary;
            const ctx = Summary.getContextData(req);

            expect(ctx).to.have.property('codicilPresent', false);
            expect(ctx).to.have.property(
                'deceasedMarriedQuestion',
                'Did Dee Ceased get married or enter into a civil partnership after the will was signed?');
            done();
        });

        it('[PROBATE] return the correct properties in ctx when codicils present', (done) => {
            const req = baseReq;
            req.session.form.will.codicils = 'optionYes';

            const Summary = steps.Summary;
            const ctx = Summary.getContextData(req);
            expect(ctx).to.have.property('codicilPresent', true);
            expect(ctx).to.have.property(
                'deceasedMarriedQuestion',
                'Did Dee Ceased get married or enter into a civil partnership after the latest codicil was signed?');
            done();
        });
    });
});
