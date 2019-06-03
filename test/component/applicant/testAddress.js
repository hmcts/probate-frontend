'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorsNumber = require('app/steps/ui/executors/number');
const testAddressData = require('test/data/find-address');
const formatAddress = address => address.replace(/\n/g, ', ');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('applicant-address', () => {
    let testWrapper;
    const expectedNextUrlForExecsNumber = ExecutorsNumber.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantAddress');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('ApplicantAddress');

        it('test right content loaded on the page', (done) => {
            const excludeKeys = ['selectAddress'];
            testWrapper.testContent(done, excludeKeys);
        });

        it('test error messages displayed for missing data', (done) => {
            const data = {addressFound: 'none'};

            testWrapper.testErrors(done, data, 'required', ['addressLine1']);
        });

        it(`test it redirects to number of executors page: ${expectedNextUrlForExecsNumber}`, (done) => {
            const data = {
                addressLine1: 'value',
                postTown: 'value',
                newPostCode: 'value'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForExecsNumber);
        });

        it('test the address dropdown box displays all addresses when the user returns to the page', (done) => {
            const sessionData = {
                postcode: testAddressData[1].postcode,
                postcodeAddress: formatAddress(testAddressData[1].formatted_address),
                addresses: testAddressData,
                addressLine1: 'value',
                postTown: 'value',
                newPostCode: 'value'
            };
            testWrapper.agent
                .post(testWrapper.pageUrl)
                .send(sessionData)
                .end(() => {
                    const contentToCheck = testAddressData.map((address, index) => {
                        const formattedAddress = formatAddress(address.formatted_address);
                        return `<option value="${index}" ${formattedAddress === sessionData.postcodeAddress ? 'selected' : ''}>${formattedAddress}</option>`;
                    });
                    testWrapper.testDataPlayback(done, contentToCheck);
                });
        });
    });
});
