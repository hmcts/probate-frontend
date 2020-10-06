'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DomicileEnglandOrWales = require('app/steps/ui/deceased/domicileengorwales');
const testCommonContent = require('test/component/common/testCommonContent.js');
const probateNewJourney = require('app/journeys/probatenewdeathcertflow');

describe('deceased-address-new', () => {
    let testWrapper;
    const expectedNextUrlForDomicileEnglandOrWales = DomicileEnglandOrWales.getUrl();

    beforeEach(() => {
        let ftValue;
        testWrapper = new TestWrapper('DeceasedAddress', ftValue, probateNewJourney);
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedAddress');

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

        it('test address schema validation when address search is unsuccessful', (done) => {
            const data = {
                addressFound: 'false'
            };
            const errorsToTest = ['addressLine1'];

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it(`test it redirects to domicile england or wales page: ${expectedNextUrlForDomicileEnglandOrWales}`, (done) => {
            const data = {
                addressLine1: 'value',
                postTown: 'value',
                newPostCode: 'value'
            };

            testWrapper.agent.post('/prepare-session/featureToggles')
                .send(ftValue)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForDomicileEnglandOrWales);
                });
        });
    });
});
