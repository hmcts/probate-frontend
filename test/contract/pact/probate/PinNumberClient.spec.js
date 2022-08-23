/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact, Matchers} = require('@pact-foundation/pact');
const {somethingLike: term} = Matchers;
const chaiAsPromised = require('chai-as-promised');
const PinNumberClient = require('app/services/PinNumber');
const config = require('config');
const getPort = require('get-port');
const assert = chai.assert;
chai.use(chaiAsPromised);

describe('Pact PinNumberClient', () => {

    let MOCK_SERVER_PORT;
    let provider;
    getPort().then(portNumber => {
        MOCK_SERVER_PORT = portNumber;
        // (1) Create the Pact object to represent your provider
        provider = new Pact({
            consumer: 'probate_frontend',
            provider: 'probate_orchestrator_service_invite_pinnumber',
            port: MOCK_SERVER_PORT,
            log: path.resolve(process.cwd(), 'logs', 'pactProbatePinNumber.log'),
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

    describe('when a request for a Pin Number', () => {
        describe('is required from a GET', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service returns pin number',
                    uponReceiving: 'a request to GET Pin Number',
                    withRequest: {
                        method: 'GET',
                        path: '/invite/pin',
                        query: 'phoneNumber=07954765765',
                        headers: {
                            'Content-Type': 'application/json',
                            'Session-Id': ctx.sessionID
                        }
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'text/plain'},
                        body: term({generate: '123456', matcher: '^[0-9]*$'})
                    }
                })
            );

            it('successfully returns pin number', (done) => {
                const pinNumberClient = new PinNumberClient('http://localhost:' + MOCK_SERVER_PORT, ctx.sessionID);
                const verificationPromise = pinNumberClient.get('07954765765', false, ctx.authToken, ctx.session.serviceAuthorization);
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });
    });

    // Write pact files
    after(() => {
        return provider.finalize();
    });

});
