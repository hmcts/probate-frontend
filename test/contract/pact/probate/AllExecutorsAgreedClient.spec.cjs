/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact} = require('@pact-foundation/pact');
const chaiAsPromised = require('chai-as-promised');
const AllExecutorsAgreed = require('app/services/AllExecutorsAgreed');
const config = require('config');
const getPort = require('get-port');
const assert = chai.assert;
chai.use(chaiAsPromised);

describe('Pact AllExecutorsAgreedClient', () => {

    let MOCK_SERVER_PORT;
    let provider;
    getPort().then(portNumber => {
        MOCK_SERVER_PORT = portNumber;
        // (1) Create the Pact object to represent your provider
        provider = new Pact({
            consumer: 'probate_frontend',
            provider: 'probate_orchestrator_service_invite_allagreed',
            port: MOCK_SERVER_PORT,
            log: path.resolve(process.cwd(), 'logs', 'pactProbateAllExecutorsAgreed.log'),
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

    describe('when a request for executors agreed flags returning true', () => {
        describe('is required from a GET and returns true', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service returns executors agreed flags with true',
                    uponReceiving: 'a request to GET executor with all agreed flags',
                    withRequest: {
                        method: 'GET',
                        path: '/invite/allAgreed/123456',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.session.serviceAuthorization
                        }
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                        body: 'true'
                    }
                })
            );

            it('successfully returns true', (done) => {
                const allExecutorsAgreedClient = new AllExecutorsAgreed('http://localhost:' + MOCK_SERVER_PORT, ctx.sessionID);
                const verificationPromise = allExecutorsAgreedClient.get(ctx.authToken, ctx.session.serviceAuthorization, '123456');
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });
    });

    describe('when a request for executors agreed flags returning false', () => {
        describe('is required from a GET and returns false', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service returns executors agreed flags with false',
                    uponReceiving: 'a request to GET executor with not all agreed flags',
                    withRequest: {
                        method: 'GET',
                        path: '/invite/allAgreed/123457',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                        body: 'false'
                    }
                })
            );

            it('successfully returns false', (done) => {
                const allExecutorsAgreedClient = new AllExecutorsAgreed('http://localhost:' + MOCK_SERVER_PORT, ctx.sessionID);
                const verificationPromise = allExecutorsAgreedClient.get(ctx.authToken, ctx.session.serviceAuthorization, '123457');
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });
    });

    // Write pact files
    after(() => {
        return provider.finalize();
    });

});
