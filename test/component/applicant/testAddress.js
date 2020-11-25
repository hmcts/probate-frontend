'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorsNumber = require('app/steps/ui/executors/number');
const formatAddress = address => address.replace(/,/g, ', ');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('applicant-address', () => {
    let testWrapper;
    let testAddressData;
    const expectedNextUrlForExecsNumber = ExecutorsNumber.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantAddress');
        testAddressData = require('test/data/find-address');
    });

    afterEach(async () => {
        delete require.cache[require.resolve('test/data/find-address')];
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantAddress');

        it('test right content loaded on the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };
            const contentToExclude = ['selectAddress'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it('test error messages displayed for missing data', (done) => {
            const data = {addressFound: 'none'};
            const errorsToTest = ['addressLine1'];

            testWrapper.testErrors(done, data, 'required', errorsToTest);
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
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const sessionData = {
                        postcode: testAddressData[1].postcode,
                        postcodeAddress: formatAddress(testAddressData[1].formattedAddress),
                        addresses: testAddressData,
                        addressLine1: 'value',
                        postTown: 'value',
                        newPostCode: 'value'
                    };

                    testWrapper.agent
                        .post(testWrapper.pageUrl)
                        .send(sessionData)
                        .end(() => {
                            const playbackData = testAddressData.map((address, index) => {
                                const formattedAddress = formatAddress(address.formattedAddress);
                                return `<option value="${index}" ${formattedAddress === sessionData.postcodeAddress ? 'selected' : ''}>${formattedAddress}</option>`;
                            });

                            testWrapper.testDataPlayback(done, playbackData);
                        });
                });
        });
    });
});
