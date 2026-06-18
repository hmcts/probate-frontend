/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact, Matchers} = require('@pact-foundation/pact');
const {like} = Matchers;
const chaiAsPromised = require('chai-as-promised');
const InviteLink = require('app/services/InviteLink');
const config = require('config');
const getPort = require('get-port');
const assert = chai.assert;
chai.use(chaiAsPromised);

describe('Pact InviteLinkClient', () => {

    let MOCK_SERVER_PORT;
    let provider;
    getPort().then(portNumber => {
        MOCK_SERVER_PORT = portNumber;
        // (1) Create the Pact object to represent your provider
        provider = new Pact({
            consumer: 'probate_frontend',
            provider: 'probate_orchestrator_service_invitelink',
            port: MOCK_SERVER_PORT,
            log: path.resolve(process.cwd(), 'logs', 'pactProbateInviteLink.log'),
            dir: path.resolve(process.cwd(), config.services.pact.pactDirectory),
            logLevel: 'INFO',
            spec: 2
        });
    });

    const ctx = {
        authToken: 'authToken',
        serviceAuthorization: 'serviceAuthToken',
        sessionID: 'sessionID'

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
    afterEach(() =>
        provider.verify()
    );

    describe('when a request to GET an Invite', () => {
        before(() =>
            provider.addInteraction({
                // The 'state' field specifies a 'Provider State'
                state: 'probate_orchestrator_service gets an invite',
                uponReceiving: 'a request to GET an invite',
                withRequest: {
                    method: 'GET',
                    path: '/invite/data/54321'
                },
                willRespondWith: {
                    status: 200,
                    headers: {'Content-Type': 'application/json'},
                    body: like({
                        email: 'address@email.com',
                        inviteId: '54321',
                        executorName: 'Jon Snow',
                        phoneNumber: '07981898999',
                        agreed: 'optionYes',
                        leadExecutorName: 'Graham Garderner'
                    })
                }
            })
        );
        it('successfully get invite', (done) => {
            const inviteClient = new InviteLink('http://localhost:' + MOCK_SERVER_PORT, ctx.sessionID);
            const verificationPromise = inviteClient.get('54321');
            assert.eventually.ok(verificationPromise).notify(done);
        });

    });
    describe('when a request to create and send a new invite', () => {
        describe('is required from a POST', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service creates and sends the invite',
                    uponReceiving: 'a request to send an invite',
                    withRequest: {
                        method: 'POST',
                        path: '/invite',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.serviceAuthorization,
                            'Session-Id': ctx.sessionID
                        },
                        body: {
                            formdataId: '123456',
                            email: 'anotheremail@address.com',
                            executorName: 'Graham Smith',
                            firstName: 'Graham',
                            lastName: 'Smith',
                            phoneNumber: '07981898999',
                            leadExecutorName: 'Graham Garderner'
                        }
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'text/plain'},
                        body: '54321'
                    }
                })
            );

            it('successfully sends invite', (done) => {
                const inviteLink = new InviteLink('http://localhost:' + MOCK_SERVER_PORT, ctx.sessionID);
                const data = {
                    formdataId: '123456',
                    email: 'anotheremail@address.com',
                    executorName: 'Graham Smith',
                    firstName: 'Graham',
                    lastName: 'Smith',
                    phoneNumber: '07981898999',
                    leadExecutorName: 'Graham Garderner'
                };

                const verificationPromise = inviteLink.post(data, ctx.authToken, ctx.serviceAuthorization);
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });
    });

    // Write pact files
    after(() => {
        return provider.finalize();
    });
});
