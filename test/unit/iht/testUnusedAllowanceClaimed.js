'use strict';

const initSteps = require('app/core/initSteps');
const coreContextMockData = require('../../data/core-context-mock-data.json');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const IhtUnusedAllowanceClaimed = steps.IhtUnusedAllowanceClaimed;

describe('IhtUnusedAllowanceClaimed', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtUnusedAllowanceClaimed.constructor.getUrl();
            expect(url).to.equal('/unused-allowance-claimed');
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
            const ctx = IhtUnusedAllowanceClaimed.getContextData(req);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                deceasedName: 'Dee Ceased',
                sessionID: 'dummy_sessionId'
            });
            done();
        });
    });
});
