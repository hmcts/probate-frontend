/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact, Matchers} = require('@pact-foundation/pact');
const {like} = Matchers;
const chaiAsPromised = require('chai-as-promised');
const IdamSessionClient = require('app/services/IdamSession');
const config = require('app/config');
const getPort = require('get-port');
const assert = chai.assert;
chai.use(chaiAsPromised);

describe('Pact IdamSessionClient', () => {

    let MOCK_SERVER_PORT;
    let provider;
    getPort().then(portNumber => {
        MOCK_SERVER_PORT = portNumber;
        // (1) Create the Pact object to represent your provider
        provider = new Pact({
            consumer: 'probate_frontend',
            provider: 'sidamService_IdamSession',
            port: MOCK_SERVER_PORT,
            log: path.resolve(process.cwd(), 'logs', 'pactIdamSessionClient.log'),
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

    describe('when a request for the idam session', () => {
        describe('is required from a GET', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'a valid user is logged on',
                    uponReceiving: 'a request for the idam session',
                    withRequest: {
                        method: 'GET',
                        path: '/details',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': like('Bearer securityCookie')
                        }
                    },
                    willRespondWith: {
                        status: 200,
                        body: {
                            'forename': like('User'),
                            'surname': like('Test'),
                            'defaultService': like('CCD'),
                            'id': like(41),
                            'roles': like([
                                'caseworker-probate',
                                'citizen',
                                'caseworker',
                                'caseworker-probate-loa1',
                                'citizen-loa1',
                                'caseworker-loa1'
                            ])
                        }
                    }
                })
            );

            it('successfully returns idam session', (done) => {
                const idamSessionClient = new IdamSessionClient('http://localhost:' + MOCK_SERVER_PORT, 'sessionId');
                const verificationPromise = idamSessionClient.get('securityCookie');
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });
    });

    describe('when a request to delete the idam session', () => {
        describe('is required from a DELETE', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'a valid user is logged on',
                    uponReceiving: 'a request to delete idam session',
                    withRequest: {
                        method: 'DELETE',
                        path: '/session/token123',
                        headers: {
                            'Authorization': like('Basic securityCookie')
                        }
                    },
                    willRespondWith: {
                        status: 200
                    }
                })
            );

            it('successfully returns idam session', (done) => {
                const idamSessionClient = new IdamSessionClient('http://localhost:' + MOCK_SERVER_PORT, 'sessionId');
                const verificationPromise = idamSessionClient.delete('token123');
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });
    });

    // Write pact files
    after(() => {
        return provider.finalize();
    });

});
