/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact} = require('@pact-foundation/pact');
const chaiAsPromised = require('chai-as-promised');
const IntestacyFormData = require('app/services/IntestacyFormData');
const config = require('app/config');
const getPort = require('get-port');
const expect = chai.expect;
const FORM_DATA_BODY_PAYLOAD = require('test/data/pacts/intestacy/fromDataClient');

chai.use(chaiAsPromised);

describe('Pact IntestacyFormData', () => {

    let MOCK_SERVER_PORT;
    let provider;
    getPort().then(portNumber => {
        MOCK_SERVER_PORT = portNumber;
        // (1) Create the Pact object to represent your provider
        provider = new Pact({
            consumer: 'probate_frontend',
            provider: 'probate_orchestrator_service_intestacy_forms',
            port: MOCK_SERVER_PORT,
            log: path.resolve(process.cwd(), 'logs', 'pactIntestacyFormDataClient.log'),
            dir: path.resolve(process.cwd(), config.services.pact.pactDirectory),
            logLevel: 'INFO',
            spec: 2
        });
    });
    const ctx = {
        sessionID: 'someSessionId',
        authToken: 'authToken',
        session: {
            serviceAuthorization: 'someServiceAuthorization'
        }
    };
    function getRequestBody() {
        const fullBody = JSON.parse(JSON.stringify(FORM_DATA_BODY_PAYLOAD));
        fullBody.type = 'Intestacy';
        return fullBody;
    }
    function getExpectedResponseBody() {

        const expectedJSON = JSON.parse(JSON.stringify(FORM_DATA_BODY_PAYLOAD));
        expectedJSON.ccdCase = {
            'id': 1535574519543819,
            'state': 'Pending'
        };
        expectedJSON.type = 'Intestacy';
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

    describe('when intestacy formdata is posted', () => {
        describe('and is required to be persisted', () => {
            before(() => {
                // (2) Start the mock server
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service persists intestacy formdata with success',
                    uponReceiving: 'a request to POST intestacy formdata',
                    withRequest: {
                        method: 'POST',
                        path: '/forms/someemailaddress@host.com',
                        headers: {
                            'Content-Type': 'application/json',
                            'Session-Id': ctx.sessionID,
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.session.serviceAuthorization
                        },
                        body: getRequestBody()
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                        body: getExpectedResponseBody()
                    }
                });
            });

            // (4) write your test(s)
            // Verify service client works as expected
            it('successfully validated form data', (done) => {
                const formDataClient = new IntestacyFormData('http://localhost:' + MOCK_SERVER_PORT, 'someSessionId');
                const verificationPromise = formDataClient.post('someemailaddress@host.com', FORM_DATA_BODY_PAYLOAD, ctx);
                expect(verificationPromise).to.eventually.eql(getExpectedResponseBody()).notify(done);
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
