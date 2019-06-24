/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact, Matchers} = require('@pact-foundation/pact');
const {like, term} = Matchers;
const chaiAsPromised = require('chai-as-promised');
const ProbateSubmitData = require('app/services/ProbateSubmitData');
const config = require('app/config');
const expect = chai.expect;
const getPort = require('get-port');
const FORM_DATA_BODY_REQUEST = require('test/data/pacts/probate/prePaymentForm');
const PAYMENT_DTO_BODY_REQUEST = require('test/data/pacts/probate/prePaymentDto');
const POST_PAYMENT_FORM_DATA_BODY_REQUEST = require('test/data/pacts/probate/postPaymentMadeForm');
const POST_PAYMENT_DTO_BODY_REQUEST = require('test/data/pacts/probate/postPaymentDto');
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

    function getExpectedPayload(json, email) {

        const expectedJSON = JSON.parse(JSON.stringify(json));
        expectedJSON.type = term({
            matcher: 'PA',
            generate: 'PA'
        });

        expectedJSON.deceased.alias = yesNoTerm();
        expectedJSON.deceased.married = yesNoTerm();
        expectedJSON.applicantEmail = term({
            matcher: '[\\w+\\-.]+@[a-z\\d\\-]+(\\.[a-z\\d\\-]+)*\\.[a-z]+',
            generate: email
        });
        expectedJSON.deceased.dob_date = addDateTimeTerm('1900-01-01T00:00:00.000Z');
        expectedJSON.deceased.dod_date = addDateTimeTerm('2019-01-01T00:00:00.000Z');
        // expectedJSON.type = 'PA';
        return expectedJSON;
    }

    function addDateTimeTerm(example) {
        return term({
            matcher: '[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T(2[0-3]|[01][0-9]):[0-5][0-9]:00.000Z',
            generate: example
        });
    }

    function yesNoTerm() {
        return term({
            matcher: 'Yes|No',
            generate: 'No'
        });
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
    context('when probate pre payment is initiated', () => {
        describe('and the form data is submitted', () => {
            before(() => {
                // (2) Start the mock server
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service receives an initial payment',
                    uponReceiving: 'a submit request to PUT probate formdata with initial payment',
                    withRequest: {
                        method: 'PUT',
                        path: '/forms/paymentinitiated.test8@gmail.com/submissions',
                        query: 'probateType=PA',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.serviceAuthorization
                        },
                        body: PAYMENT_DTO_BODY_REQUEST
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                        body: like(getExpectedPayload(FORM_DATA_BODY_REQUEST, 'paymentinitiated.test8@gmail.com'))
                    }
                });
            });
            // (4) write your test(s)
            // Verify service client works as expected
            it('successfully submitted form data', (done) => {
                const submitDataClient = new ProbateSubmitData('http://localhost:' + MOCK_SERVER_PORT, ctx.sessionID);
                const verificationPromise = submitDataClient.submit(FORM_DATA_BODY_REQUEST, PAYMENT_DTO_BODY_REQUEST,
                    ctx.authToken, ctx.serviceAuthorization);
                expect(verificationPromise).to.eventually.eql(FORM_DATA_BODY_REQUEST).notify(done);
            });
        });
    });

    context('when a probate payment is made', () => {
        describe('and the form data is submitted', () => {
            before(() => {
                // (2) Start the mock server
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service receives a successful payment',
                    uponReceiving: 'a submit request to PUT probate formdata with successful payment',
                    withRequest: {
                        method: 'PUT',
                        path: '/forms/paymentmade.test8@gmail.com/submissions',
                        query: 'probateType=PA',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.serviceAuthorization
                        },
                        body: POST_PAYMENT_DTO_BODY_REQUEST
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                        body: like(getExpectedPayload(POST_PAYMENT_FORM_DATA_BODY_REQUEST, 'paymentmade.test8@gmail.com'))
                    }
                });
            });
            // (4) write your test(s)
            // Verify service client works as expected
            it('successfully submitted form data', (done) => {
                const submitDataClient = new ProbateSubmitData('http://localhost:' + MOCK_SERVER_PORT, ctx.sessionID);
                const verificationPromise = submitDataClient.submit(POST_PAYMENT_FORM_DATA_BODY_REQUEST, POST_PAYMENT_DTO_BODY_REQUEST,
                    ctx.authToken, ctx.serviceAuthorization);
                expect(verificationPromise).to.eventually.eql(POST_PAYMENT_FORM_DATA_BODY_REQUEST).notify(done);
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
