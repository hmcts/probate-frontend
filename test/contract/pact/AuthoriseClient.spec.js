/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact, Matchers} = require('@pact-foundation/pact');
const {like} = Matchers;
const chaiAsPromised = require('chai-as-promised');
const AuthoriseClient = require('app/services/Authorise');
const config = require('app/config');
const getPort = require('get-port');
const assert = chai.assert;
chai.use(chaiAsPromised);

describe.skip('Pact AuthoriseClient', () => {

    let MOCK_SERVER_PORT;
    let provider;
    getPort().then(portNumber => {
        MOCK_SERVER_PORT = portNumber;
        // (1) Create the Pact object to represent your provider
        provider = new Pact({
            consumer: 'probate_frontend',
            provider: 'sidamService_Authorise',
            port: MOCK_SERVER_PORT,
            log: path.resolve(process.cwd(), 'logs', 'pactAuthoriseClient.log'),
            dir: path.resolve(process.cwd(), config.services.pact.pactDirectory),
            logLevel: 'INFO',
            spec: 2
        });
    });

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

    describe('when a request for a service authorisation token', () => {
        describe('is required from a POST', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_frontend service credentials exist',
                    uponReceiving: 'a request  probate_frontend service authorisation token',
                    withRequest: {
                        method: 'POST',
                        path: '/lease',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: {
                            microservice: 'probate_frontend',
                            oneTimePassword: like('AAAAAAAAAAAA')
                        }
                    },
                    willRespondWith: {
                        status: 200,
                        body: like('hdsjfhdshjhdjfhjsdhfjsd')
                    }
                })
            );

            it('successfully returns idam session', (done) => {
                const authoriseClient = new AuthoriseClient('http://localhost:' + MOCK_SERVER_PORT, 'sessionId');
                const verificationPromise = authoriseClient.post();
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });
    });

    // Write pact files
    after(() => {
        return provider.finalize();
    });

});
