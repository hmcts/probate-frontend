'use strict';

const {expect} = require('chai');
const testConfig = require('config');
const PostcodeLookup = require('app/services/PostcodeLookup');

const POSTCODE_SERVICE_TOKEN = testConfig.postcodeLookup.token;

describe('Address Lookup API Tests', () => {
    let postcodeLookup;

    beforeEach(() => {
        postcodeLookup = new PostcodeLookup();
    });

    afterEach(() => {
        testConfig.services.postcode.token = POSTCODE_SERVICE_TOKEN;
    });

    describe('Invalid postcode token', () => {
        it('returns systemError', async () => {
            testConfig.services.postcode.token = 'invalid-token';

            try {
                await postcodeLookup.get(
                    testConfig.postcodeLookup.singleAddressPostcode
                );

                expect.fail('Expected postcode lookup to reject');
            } catch (err) {
                expect(err).to.be.instanceOf(Error);
                expect(err.message).to.equal('systemError');
            }
        });
    });

    describe('Single address returned for postcode', () => {
        it('returns a single address', async () => {
            const result = await postcodeLookup.get(
                testConfig.postcodeLookup.singleAddressPostcode
            );

            expect(result).to.have.lengthOf(1);
            expect(result[0]).to.deep.equal({
                postcode: testConfig.postcodeLookup.singleAddressPostcode,
                formattedAddress: testConfig.postcodeLookup.singleFormattedAddress
            });
        });
    });

    describe('Multiple addresses returned for postcode', () => {
        it('returns multiple addresses', async () => {
            const result = await postcodeLookup.get(
                testConfig.postcodeLookup.multipleAddressPostcode
            );

            expect(result).to.have.lengthOf(12);
        });
    });

    describe('Partial postcode test', () => {
        it('returns the maximum number of results', async () => {
            const result = await postcodeLookup.get(
                testConfig.postcodeLookup.partialAddressPostcode
            );

            expect(result).to.have.lengthOf(100);
        });
    });

    describe('Invalid postcode test', () => {
        it('returns no addresses for an invalid postcode', async () => {
            const result = await postcodeLookup.get(
                testConfig.postcodeLookup.invalidAddressPostcode
            );

            expect(result).to.deep.equal([]);
        });
    });

    describe('No postcode entered test', () => {
        it('returns no addresses when no postcode is entered', async () => {
            const result = await postcodeLookup.get(
                testConfig.postcodeLookup.emptyAddressPostcode
            );

            expect(result).to.deep.equal([]);
        });
    });
});
