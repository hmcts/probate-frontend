'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedAddress = steps.DeceasedAddress;

describe('DeceasedAddress', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedAddress.constructor.getUrl();
            expect(url).to.equal('/deceased-address');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with the deceased address', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {
                    form: {
                        caseType: 'gop'
                    },
                    caseType: 'gop'
                },
                body: {
                    addressLine1: '143 Caerfai Bay Road',
                    postTown: 'town',
                    newPostCode: 'L23 6WW',
                    country: 'United Kingdon',
                    postcode: 'L23 6WW'
                }
            };
            const ctx = DeceasedAddress.getContextData(req);
            expect(ctx).to.deep.equal({
                addressLine1: '143 Caerfai Bay Road',
                postTown: 'town',
                country: 'United Kingdon',
                newPostCode: 'L23 6WW',
                postcode: 'L23 6WW',
                sessionID: 'dummy_sessionId',
                caseType: 'gop',
                userLoggedIn: false
            });
            done();
        });
    });
});
