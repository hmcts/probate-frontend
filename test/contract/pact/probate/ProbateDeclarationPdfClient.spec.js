/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact} = require('@pact-foundation/pact');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const ProbateDeclarationPdf = require('app/services/DeclarationPdf');
const config = require('config');
const assert = chai.assert;
const getPort = require('get-port');
const DOC_BODY_PAYLOAD = require('test/data/pacts/probate/legalDeclaration');
const DOC_BODY_INVALID_PAYLOAD = require('test/data/pacts/probate/invalidNoApplicantEmailAddressCoverSheet');
chai.use(chaiAsPromised);

describe('Pact ProbateDeclarationPdf', () => {

    // (1) Create the Pact object to represent your provider
    let MOCK_SERVER_PORT;
    let provider;
    getPort().then(portNumber => {
        MOCK_SERVER_PORT = portNumber;
        // (1) Create the Pact object to represent your provider
        provider = new Pact({
            consumer: 'probate_frontend',
            provider: 'probate_orchestrator_service_documents_legal_declaration',
            port: MOCK_SERVER_PORT,
            log: path.resolve(process.cwd(), 'logs', 'pactProbateLegalDeclarationPdf.log'),
            dir: path.resolve(process.cwd(), config.services.pact.pactDirectory),
            logLevel: 'INFO',
            spec: 2
        });
    });

    const serviceToken = 'tok123';

    const req = {
        authToken: 'authToken',
        session: {
            form: {
                legalDeclaration: DOC_BODY_PAYLOAD
            },
            serviceAuthorization: 'serviceAuthToken'
        }
    };
    const InvalidReq = {
        sessionID: 'someSessionId',
        authToken: 'authToken',
        session: {
            form: {
                legalDeclaration: DOC_BODY_INVALID_PAYLOAD
            },
            serviceAuthorization: 'serviceAuthToken'
        }
    };

    // Setup a Mock Server before unit tests run.
    // This server acts as a Test Double for the real Provider API.
    // We then call addInteraction() for each test to configure the Mock Service
    // to act like the Provider
    // It also sets up expectations for what requests are to come, and will fail
    // if the calls are not seen.
    before(() =>
        provider.setup()
    );

    beforeEach(() => {
        nock(config.services.idam.s2s_url)
            .post('/lease')
            .reply(200, serviceToken);
    });

    // After each individual test (one or more interactions)
    // we validate that the correct request came through.
    // This ensures what we _expect_ from the provider, is actually
    // what we've asked for (and is what gets captured in the contract)
    afterEach(() => provider.verify());

    describe('when legal declaration doc is posted', () => {
        describe('and is required to be downloaded', () => {
            before(() => {
                // (2) Start the mock server
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service generates legal declaration byte[] with success',
                    uponReceiving: 'a request to POST legal declaration doc',
                    withRequest: {
                        method: 'POST',
                        path: '/documents/generate/legalDeclaration',
                        headers: {
                            'Content-Type': 'application/json',
                            'Session-Id': req.sessionID,
                            'Authorization': req.authToken,
                            'ServiceAuthorization': serviceToken
                        },
                        body: DOC_BODY_PAYLOAD
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/octet-stream'},
                    }
                });
            });

            // (4) write your test(s)
            // Verify service client works as expected
            it('successfully validated form data', (done) => {
                const declarationPdfClient = new ProbateDeclarationPdf('http://localhost:' + MOCK_SERVER_PORT, req.sessionID);
                const verificationPromise = declarationPdfClient.post(req);
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });
    });
    describe('when Invalid legal declaration doc is posted', () => {
        describe('and is required to be downloaded', () => {
            before(() => {
                // (2) Start the mock server
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service generates legal declaration byte[] with validation errors',
                    uponReceiving: 'a request to POST Invalid legal declaration doc',
                    withRequest: {
                        method: 'POST',
                        path: '/documents/generate/legalDeclaration',
                        headers: {
                            'Content-Type': 'application/json',
                            'Session-Id': req.sessionID,
                            'Authorization': req.authToken,
                            'ServiceAuthorization': serviceToken
                        },
                        body: DOC_BODY_INVALID_PAYLOAD
                    },
                    willRespondWith: {
                        status: 400
                    }
                });
            });
            // (4) write your test(s)
            // Verify service client works as expected
            it('successfully Invalid form data', (done) => {
                const declarationPdfClient = new ProbateDeclarationPdf('http://localhost:' + MOCK_SERVER_PORT, InvalidReq.sessionID);
                const verificationPromise = declarationPdfClient.post(InvalidReq);
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });
    });
    // (6) write the pact file for this consumer-provider pair,
    // and shutdown the associated mock server.
    // You should do this only _once_ per Provider you are testing.
    after(() => {
        nock.cleanAll();
        return provider.finalize();
    });
});
