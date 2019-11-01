/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact} = require('@pact-foundation/pact');
const chaiAsPromised = require('chai-as-promised');
const ProbateSubmitData = require('app/services/ProbateSubmitData');
const config = require('app/config');
const expect = chai.expect;
const getPort = require('get-port');
const FORM_DATA_BODY_REQUEST = require('test/data/pacts/probate/submitDataClient');
const SINGLE_EXE_FORM_DATA_BODY_REQUEST = require('test/data/pacts/probate/submitSingleExeDataClinet');
const MULTIPLE_EXE_FORM_DATA_BODY_REQUEST = require('test/data/pacts/probate/submitMultipleExeDataClinet');
chai.use(chaiAsPromised);

describe('Pact Probate Submit Data', () => {

    let MOCK_SERVER_PORT;
    let provider;
    // (1) Create the Pact object to represent your provider
    getPort().then(portNumber => {
        MOCK_SERVER_PORT = portNumber;
        // (1) Create the Pact object to represent your provider
        provider = new Pact({
            consumer: 'probate_frontend',
            provider: 'probate_orchestrator_service_probate_submit',
            port: MOCK_SERVER_PORT,
            log: path.resolve(process.cwd(), 'logs', 'pactProbateSubmitData.log'),
            dir: path.resolve(process.cwd(), config.services.pact.pactDirectory),
            logLevel: 'INFO',
            spec: 2
        });
    });
    const ctx = {
        sessionID: 'someSessionId',
        authToken: 'authToken',
        serviceAuthorization: 'someServiceAuthorization'
    };
    function getRequestPayload(json) {
        const expectedJSON = JSON.parse(JSON.stringify(json));
        expectedJSON.type = 'PA';
        return expectedJSON;
    }
    function getExpectedPayload(json) {

        const expectedJSON = JSON.parse(JSON.stringify(json));
        expectedJSON.ccdCase = {
            'id': 1535574519543819,
            'state': 'PAAppCreated'
        };
        expectedJSON.type = 'PA';
        return expectedJSON;
    }
    // Setup a Mock Server before unit tests run.
    // This server acts as a Test Double for the real Provider API.
    // We then call addInteraction() for each test to configure the Mock Service
    // to act like the Provider
    // It also sets up expectations for what requests are to come, and will fail
    // if the calls are not seen.
    before(() =>
        provider.setup()
    );
    // After each individual test (one or more interactions)
    // we validate that the correct request came through.
    // This ensures what we _expect_ from the provider, is actually
    // what we've asked for (and is what gets captured in the contract)
    afterEach(() => provider.verify());
    context('when probate partial formdata is posted', () => {
        describe('and is required to be submitted', () => {
            before(() => {
                // (2) Start the mock server
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service submits probate formdata with success',
                    uponReceiving: 'a submit request to POST probate formdata',
                    withRequest: {
                        method: 'PUT',
                        path: '/forms/someemailaddress@host.com/submissions',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.serviceAuthorization
                        },
                        body: getRequestPayload(FORM_DATA_BODY_REQUEST)
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                        body: getExpectedPayload(FORM_DATA_BODY_REQUEST)
                    }
                });
            });
            // (4) write your test(s)
            // Verify service client works as expected
            it('successfully submitted form data', (done) => {
                const submitDataClient = new ProbateSubmitData('http://localhost:' + MOCK_SERVER_PORT, ctx.sessionID);
                const verificationPromise = submitDataClient.submit(FORM_DATA_BODY_REQUEST, ctx.authToken, ctx.serviceAuthorization);
                expect(verificationPromise).to.eventually.eql(getExpectedPayload(FORM_DATA_BODY_REQUEST)).notify(done);
            });
        });
    });
    context('when probate single executor formdata is posted', () => {
        describe('and is required to be submitted', () => {
            before(() => {
                // (2) Start the mock server
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service submits single probate formdata with success',
                    uponReceiving: 'a submit single exe request to POST probate formdata ',
                    withRequest: {
                        method: 'PUT',
                        path: '/forms/ccdcasedata1@gmail.com/submissions',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.serviceAuthorization
                        },
                        body: getRequestPayload(SINGLE_EXE_FORM_DATA_BODY_REQUEST)
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                        body: getExpectedPayload(SINGLE_EXE_FORM_DATA_BODY_REQUEST)
                    }
                });
            });

            // (4) write your test(s)
            // Verify service client works as expected
            it('successfully submitted form data', (done) => {
                const submitDataClient = new ProbateSubmitData('http://localhost:' + MOCK_SERVER_PORT, ctx.sessionID);
                const verificationPromise = submitDataClient.submit(SINGLE_EXE_FORM_DATA_BODY_REQUEST, ctx.authToken, ctx.serviceAuthorization);
                expect(verificationPromise).to.eventually.eql(getExpectedPayload(SINGLE_EXE_FORM_DATA_BODY_REQUEST)).notify(done);
            });
        });
    });
    context('when probate multiple executor formdata is posted', () => {
        describe('and is required to be submitted', () => {
            before(() => {
                // (2) Start the mock server
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service submits multiple probate formdata with success',
                    uponReceiving: 'a submit multiple exe request to POST probate formdata ',
                    withRequest: {
                        method: 'PUT',
                        path: '/forms/maggy.penelope@sellcow.net/submissions',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.serviceAuthorization
                        },
                        body: getRequestPayload(MULTIPLE_EXE_FORM_DATA_BODY_REQUEST)
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                        body: getExpectedPayload(MULTIPLE_EXE_FORM_DATA_BODY_REQUEST)
                    }
                });
            });
            // (4) write your test(s)
            // Verify service client works as expected
            it('successfully submitted form data', (done) => {
                const submitDataClient = new ProbateSubmitData('http://localhost:' + MOCK_SERVER_PORT, ctx.sessionID);
                const verificationPromise = submitDataClient.submit(MULTIPLE_EXE_FORM_DATA_BODY_REQUEST, ctx.authToken, ctx.serviceAuthorization);
                expect(verificationPromise).to.eventually.eql(getExpectedPayload(MULTIPLE_EXE_FORM_DATA_BODY_REQUEST)).notify(done);
            });
        });
    });
    // (6) write the pact file for this consumer-provider pair,
    // and shutdown the associated mock server.
    // You should do this only _once_ per Provider you are testing.
    after(() => {
        return provider.finalize();
    });
});
