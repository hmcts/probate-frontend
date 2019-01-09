/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact} = require('@pact-foundation/pact');
const chaiAsPromised = require('chai-as-promised');
const IntestacyFormData = require('app/services/IntestacyFormData');

const expect = chai.expect;
const MOCK_SERVER_PORT = 2204;

chai.use(chaiAsPromised);

describe('Pact IntestacyFormData', () => {
    // (1) Create the Pact object to represent your provider
    const provider = new Pact({
        consumer: 'probate_frontend_intestacyformdatapersistence_client',
        provider: 'probate_orchestrator_intestacyformdataperistence_provider',
        port: MOCK_SERVER_PORT,
        log: path.resolve(process.cwd(), 'logs', 'pact.log'),
        dir: path.resolve(process.cwd(), 'pacts'),
        logLevel: 'INFO',
        spec: 2
    });

    // Define expected payloads
    const FORM_DATA_BODY_PARTIAL =
        {
            'type': 'Intestacy',
            'applicant': {
                'email': 'someemailaddress@host.com',
                'firstName': 'Jon',
                'lastName': 'Snow',
                'address': 'Pret a Manger St. Georges Hospital Blackshaw Road London SW17 0QT',
                'postCode': 'SW17 0QT',
                'phoneNumber': '123455678',
                'addressFound': 'Yes',
                'freeTextAddress': 'Pret a Manger St. Georges Hospital Blackshaw Road',
                'adoptionInEnglandOrWales': 'Yes'
            },
            'deceased': {
                'firstName': 'Ned',
                'lastName': 'Stark',
                'dob_date': '1930-01-01',
                'dod_date': '2018-01-01',
                'address': 'Winterfell, Westeros',
                'addressFound': 'Yes',
                'postCode': 'SW17 0QT',
                'freeTextAddress': 'Winterfell, Westeros',
                'alias': 'Yes',
                'allDeceasedChildrenOverEighteen': 'Yes',
                'anyDeceasedChildrenDieBeforeDeceased': 'No',
                'anyDeceasedGrandchildrenUnderEighteen': 'No',
                'anyChildren': 'No'
            },
            'declaration': {
                'declarationCheckbox': 'Yes'
            }
        };

    context('when intestacy formdata is posted', () => {
        describe('and is required to be persisted', () => {
            before(done => {
                // (2) Start the mock server
                provider
                    .setup()
                    // (3) add interactions to the Mock Server, as many as required
                    .then(() => {
                        return provider.addInteraction({
                            // The 'state' field specifies a 'Provider State'
                            state: 'provider persists intestacy formdata with success',
                            uponReceiving: 'a request to POST intestacy formdata',
                            withRequest: {
                                method: 'POST',
                                path: '/forms/someemailaddress@host.com',
                                headers: {'Content-Type': 'application/json', 'Session-Id': 'someSessionId'},
                                body: FORM_DATA_BODY_PARTIAL
                            },
                            willRespondWith: {
                                status: 200,
                                headers: {'Content-Type': 'application/json'},
                                body: FORM_DATA_BODY_PARTIAL
                            }
                        });
                    })
                    .then(() => done());
            });

            // (4) write your test(s)
            // Verify service client works as expected
            it('successfully validated form data', (done) => {
                const formDataClient = new IntestacyFormData('http://localhost:2204', 'someSessionId');
                const verificationPromise = formDataClient.post('someemailaddress@host.com', FORM_DATA_BODY_PARTIAL);
                expect(verificationPromise).to.eventually.eql(FORM_DATA_BODY_PARTIAL).notify(done);
            });

            // (6) write the pact file for this consumer-provider pair,
            // and shutdown the associated mock server.
            // You should do this only _once_ per Provider you are testing.
            after(() => {
                return provider.finalize();
            });
        });
    });

});
