/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact} = require('@pact-foundation/pact');
const chaiAsPromised = require('chai-as-promised');
const ProbateFormData = require('app/services/ProbateFormData');

const expect = chai.expect;
const MOCK_SERVER_PORT = 2203;

chai.use(chaiAsPromised);

describe('Pact ProbateFormData', () => {
    // (1) Create the Pact object to represent your provider
    const provider = new Pact({
        consumer: 'probate_frontend_probateformdatapersistence_client',
        provider: 'probate_orchestrator_formdataperistence_provider',
        port: MOCK_SERVER_PORT,
        log: path.resolve(process.cwd(), 'logs', 'pact.log'),
        dir: path.resolve(process.cwd(), 'pacts'),
        logLevel: 'INFO',
        spec: 2
    });

    // Define expected payloads
    const EXPECTED_BODY = {
        'body': {
            'errors': [

            ],
            'status': 'SUCCESS'
        }
    };

    const FORM_DATA_BODY = {
        'id': 'someId',
        'formdata': {
            'applicant': {
                'email': 'someemaildaddress@host.com',
                'address': 'Flat 1, Somewhere Rd, Nowhere.',
                'executor': 'Yes',
                'lastName': 'Smith',
                'postcode': 'NW1 8SS',
                'referrer': 'ApplicantAddress',
                'firstName': 'Bob',
                'phoneNumber': '123456780',
                'addressFound': 'none',
                'freeTextAddress': 'Flat 1 Somewhere Rd, Nowhere.',
                'nameAsOnTheWill': 'Yes'
            },
            'submissionReference': 'submissionRef'
        },
        'submissionReference': 'submissionRef'
    };

    context('when formdata is posted', () => {
        describe('and is required to be persisted', () => {
            before(done => {
                // (2) Start the mock server
                provider
                    .setup()
                    // (3) add interactions to the Mock Server, as many as required
                    .then(() => {
                        return provider.addInteraction({
                            // The 'state' field specifies a 'Provider State'
                            state: 'provider persists formdata with success',
                            uponReceiving: 'a request to POST formdata',
                            withRequest: {
                                method: 'POST',
                                path: '/formdata',
                                headers: {'Content-Type': 'application/json', 'Session-Id': 'someSessionId'},
                                body: FORM_DATA_BODY
                            },
                            willRespondWith: {
                                status: 200,
                                headers: {'Content-Type': 'application/json'},
                                body: EXPECTED_BODY
                            }
                        });
                    })
                    .then(() => done());
            });

            // (4) write your test(s)
            // Verify service client works as expected
            it('successfully validated form data', (done) => {
                const formDataClient = new ProbateFormData('http://localhost:2203/formdata', 'someSessionId');
                const verificationPromise = formDataClient.post('someId', FORM_DATA_BODY);
                const expectedResult = {
                    'body': {
                        'errors': [],
                        'status': 'SUCCESS'
                    }
                };
                expect(verificationPromise).to.eventually.eql(expectedResult).notify(done);
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
