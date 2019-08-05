/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact, Matchers} = require('@pact-foundation/pact');
const {like} = Matchers;
const chaiAsPromised = require('chai-as-promised');
const Oauth2TokenClient = require('app/services/Oauth2Token');
const config = require('app/config');
const getPort = require('get-port');
const assert = chai.assert;
chai.use(chaiAsPromised);

describe.skip('Pact Oauth2TokenClient', () => {

    let MOCK_SERVER_PORT;
    let provider;
    getPort().then(portNumber => {
        MOCK_SERVER_PORT = portNumber;
        // (1) Create the Pact object to represent your provider
        provider = new Pact({
            consumer: 'probate_frontend',
            provider: 'sidamService_Oauth2Token',
            port: MOCK_SERVER_PORT,
            log: path.resolve(process.cwd(), 'logs', 'pactOauth2TokenClient.log'),
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

    describe('when a request for a token', () => {
        describe('is required from a POST', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'a valid authorization code is passed in',
                    uponReceiving: 'a request for a token',
                    withRequest: {
                        method: 'POST',
                        path: '/oauth2/token',
                        body: 'grant_type=authorization_code&code=code&redirect_uri=redirectUri',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': like('Basic cHJvYmF0ZToxMjM0NTY=')
                        }
                    },
                    willRespondWith: {
                        status: 201,
                        body: {
                            'access_token': like('eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJnNDg2cG01NGVybjdvNjVqYms5bmR2ZXVqd' +
                                'CIsInN1YiI6IjQxIiwiaWF0Ij'),
                            'expires_in': like(28800),
                            'token_type': 'Bearer'
                        }
                    }
                })
            );

            it('successfully returns token', (done) => {
                const oauth2TokenClient = new Oauth2TokenClient('http://localhost:' + MOCK_SERVER_PORT, 'sessionId');
                const verificationPromise = oauth2TokenClient.post('code', 'redirectUri');
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });
    });

    // Write pact files
    after(() => {
        return provider.finalize();
    });

});
