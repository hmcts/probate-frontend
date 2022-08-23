/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact} = require('@pact-foundation/pact');
const chaiAsPromised = require('chai-as-promised');
const ProbateSubmitData = require('app/services/SubmitData');
const config = require('config');
const expect = chai.expect;
const getPort = require('get-port');
const FORM_DATA_BODY_REQUEST = require('test/data/pacts/probate/submitDataClient');
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
        session: {
            serviceAuthorization: 'someServiceAuthorization'
        },
        paymentDto: {
            id: 'paymentDtoID',
            amount: 273.0,
            description: 'description',
            reference: 'RC-some-reference',
            date_created: '2022-01-01',
            ccd_case_number: '1535574519543819'
        }
    };

    const expectedPayload = [{
        id: 'paymentDtoID',
        value: {
            date: '2022-01-01',
            amount: 273.0,
            method: 'pba',
            siteId: null,
            status: 'Success',
            reference: 'RC-some-reference',
            transactionId: null
        }
    }];

    function getRequestPayload() {

        const expectedJSON = JSON.parse(JSON.stringify(MULTIPLE_EXE_FORM_DATA_BODY_REQUEST));
        expectedJSON.type = 'intestacy';
        expectedJSON.ccdCase = {id: 1535574519543819};
        return expectedJSON;
    }

    function getExpectedPayload() {

        const expectedJSON = JSON.parse(JSON.stringify(MULTIPLE_EXE_FORM_DATA_BODY_REQUEST));
        expectedJSON.ccdCase = {
            'id': 1535574519543819,
        };
        expectedJSON.type = 'intestacy';
        expectedJSON.payment = expectedPayload;
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
                        path: '/forms/1535574519543819/submissions',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.serviceAuthorization
                        },
                        body: ctx.paymentDto
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                        body: getExpectedPayload()
                    }
                });
            });
            // (4) write your test(s)
            // Verify service client works as expected
            it('successfully submitted form data', (done) => {
                const submitDataClient = new ProbateSubmitData('http://localhost:' + MOCK_SERVER_PORT, ctx.sessionID);
                const verificationPromise = submitDataClient.submit(getRequestPayload(FORM_DATA_BODY_REQUEST), ctx.paymentDto, ctx.authToken, ctx.serviceAuthorization, 'gop');
                expect(verificationPromise).to.eventually.eql(getExpectedPayload()).notify(done);
            });
        });
    });
    after(() => {
        return provider.finalize();
    });
});
