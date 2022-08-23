/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact} = require('@pact-foundation/pact');
const chaiAsPromised = require('chai-as-promised');
const ProbateCoverSheetPdf = require('app/services/CoverSheetPdf');
const nock = require('nock');
const config = require('config');
const assert = chai.assert;
const getPort = require('get-port');
const DOC_BODY_PAYLOAD = require('test/data/pacts/probate/coverSheet');
const DOC_BODY_NO_DOCS_PAYLOAD = require('test/data/pacts/probate/coverSheetNoDocsRequired');
const DOC_BODY_INVALID_PAYLOAD = require('test/data/pacts/probate/invalidNoApplicantEmailAddressCoverSheet');
chai.use(chaiAsPromised);

describe('Pact ProbateCoverSheetPdf', () => {

    let MOCK_SERVER_PORT;
    let provider;
    // (1) Create the Pact object to represent your provider
    getPort().then(portNumber => {
        MOCK_SERVER_PORT = portNumber;
        // (1) Create the Pact object to represent your provider
        provider = new Pact({
            consumer: 'probate_frontend',
            provider: 'probate_orchestrator_service_documents_cover_sheet',
            port: MOCK_SERVER_PORT,
            log: path.resolve(process.cwd(), 'logs', 'pactProbateCoverSheetPdf.log'),
            dir: path.resolve(process.cwd(), config.services.pact.pactDirectory),
            logLevel: 'INFO',
            spec: 2
        });
    });
    const serviceToken = 'tok123';

    const req = {
        // sessionID: 'someSessionId',
        authToken: 'authToken',
        session: {
            form: {
                applicant: {
                    address: {
                        formattedAddress: 'addressLine1',
                    },
                    firstName: 'Appfn',
                    lastName: 'Surname'
                },
                ccdCase: {id: '123454'},
                registry: {address: 'manchester'},
                caseType: 'gop'
            },
            langauge: 'en',
            serviceAuthorization: 'serviceAuthToken'
        }
    };
    const reqInvalid = {
        // sessionID: 'someSessionId',
        authToken: 'authToken',
        session: {
            form: {
                applicant: {
                    address: {
                        formattedAddress: '',
                    },
                    firstName: 'Appfn',
                    lastName: 'Surname'
                },
                ccdCase: {id: '123454'},
                registry: {address: 'manchester'},
                caseType: 'gop'
            },
            langauge: 'en',
            serviceAuthorization: 'serviceAuthToken'
        }
    };

    const reqNoDocsRequired = {
        // sessionID: 'someSessionId',
        authToken: 'authToken',
        session: {
            form: {
                applicant: {
                    address: {
                        formattedAddress: 'addressLine1',
                    },
                    firstName: 'Appfn',
                    lastName: 'Surname',
                    relationshipToDeceased: 'optionSpousePartner'
                },
                deceased: {
                    married: 'optionYes'
                },
                ccdCase: {id: '123454'},
                registry: {address: 'manchester'},
                caseType: 'intestacy'
            },
            langauge: 'en',
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

    describe('when cover sheet doc is posted', () => {
        describe('and is required to be downloaded', () => {
            before(() => {
                // (2) Start the mock server
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service generates cover sheet byte[] with success',
                    uponReceiving: 'a request to POST cover sheet doc',
                    withRequest: {
                        method: 'POST',
                        path: '/documents/generate/bulkScanCoversheet',
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
                const coverSheetPdfClient = new ProbateCoverSheetPdf('http://localhost:' + MOCK_SERVER_PORT, req.sessionID);
                const verificationPromise = coverSheetPdfClient.post(req);
                assert.eventually.ok(verificationPromise).notify(done);
            });
            // (6) write the pact file for this consumer-provider pair,
            // and shutdown the associated mock server.
            // You should do this only _once_ per Provider you are testing.
        });
    });
    describe('when invalid cover sheet doc is posted', () => {
        describe('and is required to be downloaded', () => {
            before(() => {
                // (2) Start the mock server
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service generates cover sheet byte[] with validation errors',
                    uponReceiving: 'a request to POST invalid cover sheet doc',
                    withRequest: {
                        method: 'POST',
                        path: '/documents/generate/bulkScanCoversheet',
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
            it('successfully Invalidate form data', (done) => {
                const coverSheetPdfClient = new ProbateCoverSheetPdf('http://localhost:' + MOCK_SERVER_PORT, req.sessionID);
                const verificationPromise = coverSheetPdfClient.post(reqInvalid);
                assert.eventually.ok(verificationPromise).notify(done);
            });
            // (6) write the pact file for this consumer-provider pair,
            // and shutdown the associated mock server.
            // You should do this only _once_ per Provider you are testing.
        });
    });
    describe('when valid cover sheet doc is posted intestacy and no docs required', () => {
        describe('and is required to be downloaded', () => {
            before(() => {
                // (2) Start the mock server
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service generates cover sheet byte[] with validation success',
                    uponReceiving: 'a request to POST invalid cover sheet doc',
                    withRequest: {
                        method: 'POST',
                        path: '/documents/generate/bulkScanCoversheet',
                        headers: {
                            'Content-Type': 'application/json',
                            'Session-Id': req.sessionID,
                            'Authorization': req.authToken,
                            'ServiceAuthorization': serviceToken
                        },
                        body: DOC_BODY_NO_DOCS_PAYLOAD
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/octet-stream'},
                    }
                });
            });
            // (4) write your test(s)
            // Verify service client works as expected
            it('successfully Invalidate form data', (done) => {
                const coverSheetPdfClient = new ProbateCoverSheetPdf('http://localhost:' + MOCK_SERVER_PORT, req.sessionID);
                const verificationPromise = coverSheetPdfClient.post(reqNoDocsRequired);
                assert.eventually.ok(verificationPromise).notify(done);
            });
            // (6) write the pact file for this consumer-provider pair,
            // and shutdown the associated mock server.
            // You should do this only _once_ per Provider you are testing.
        });
    });
    after(() => {
        nock.cleanAll();
        return provider.finalize();
    });
});
