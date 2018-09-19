'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtMethod = require('app/steps/ui/iht/method/index');

describe('deceased-address', () => {
    let testWrapper;
    const expectedNextUrlForIhtMethod = IhtMethod.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedAddress');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
           const excludeKeys = ['selectAddress'];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test address schema validation when no address search has been done', (done) => {
            const data = {addressFound: 'none'};

            testWrapper.testErrors(done, data, 'required', ['postcodeLookup']);

        });

        it('test address schema validation when address search is successful, but no address is selected/entered', (done) => {
            const data = {addressFound: 'true'};

            testWrapper.testErrors(done, data, 'oneOf', ['crossField']);

        });

        it('test address schema validation when address search is successful, and two addresses are provided', (done) => {
            const data = {
                addressFound: 'true',
                freeTextAddress: 'free text address',
                postcodeAddress: 'postcode address'
            };

            testWrapper.testErrors(done, data, 'oneOf', ['crossField']);

        });

        it('test address schema validation when address search is unsuccessful', (done) => {
            const data = {
                addressFound: 'false'
            };

            testWrapper.testErrors(done, data, 'required', ['freeTextAddress']);

        });

        it(`test it redirects to iht method page: ${expectedNextUrlForIhtMethod}`, (done) => {
            const data = {
                postcode: 'ea1 eaf',
                postcodeAddress: '102 Petty France'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtMethod);
        });

    });
});
