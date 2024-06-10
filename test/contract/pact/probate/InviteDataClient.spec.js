/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact} = require('@pact-foundation/pact');
const chaiAsPromised = require('chai-as-promised');
const InviteData = require('app/services/InviteData');
const config = require('config');
const getPort = require('get-port');
const assert = chai.assert;
chai.use(chaiAsPromised);

describe('Pact InviteDataClient', () => {

    let MOCK_SERVER_PORT;
    let provider;
    getPort().then(portNumber => {
        MOCK_SERVER_PORT = portNumber;
        // (1) Create the Pact object to represent your provider
        provider = new Pact({
            consumer: 'probate_frontend',
            provider: 'probate_orchestrator_service_invitedata',
            port: MOCK_SERVER_PORT,
            log: path.resolve(process.cwd(), 'logs', 'pactProbateInviteData.log'),
            dir: path.resolve(process.cwd(), config.services.pact.pactDirectory),
            logLevel: 'INFO',
            spec: 2
        });
    });

    const ctx = {
        sessionID: 'someSessionId',
        authToken: 'authToken',
        serviceAuthorization: 'serviceAuthToken'

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

    describe('when a request to reset executors agreed flags', () => {
        describe('is required from a POST', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service resets agreed flags',
                    uponReceiving: 'a request to POST reset agreed flags',
                    withRequest: {
                        method: 'POST',
                        path: '/invite/resetAgreed/123456',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.serviceAuthorization
                        }
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                        body: '123456'
                    }
                })
            );
            it('successfully resets agreed flags', (done) => {
                const inviteDataClient = new InviteData('http://localhost:' + MOCK_SERVER_PORT, ctx.sessionID);
                const verificationPromise = inviteDataClient.resetAgreedFlag('123456', ctx);
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });

    });
    describe('when a request to set an executor agreed flag', () => {
        describe('is required from a POST', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service sets the agreed flag',
                    uponReceiving: 'a request to POST set an agreed flag',
                    withRequest: {
                        method: 'POST',
                        path: '/invite/agreed/123456',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.serviceAuthorization
                        },
                        body: {
                            inviteId: '54321',
                            agreed: 'optionYes'
                        }
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                        body: '54321'
                    }
                })
            );

            it('successfully sets agreed flag', (done) => {
                const inviteDataClient = new InviteData('http://localhost:' + MOCK_SERVER_PORT, ctx.sessionID);
                const data = {
                    inviteId: '54321',
                    agreed: 'optionYes'
                };
                const verificationPromise = inviteDataClient.setAgreedFlag(ctx.authToken, ctx.serviceAuthorization, '123456', data);
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });

    });
    describe('when a request to update an executor contact details', () => {
        describe('is required from a POST', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service updates the contact details',
                    uponReceiving: 'a request to POST to update contact details',
                    withRequest: {
                        method: 'POST',
                        path: '/invite/contactdetails/123456',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.serviceAuthorization
                        },
                        body: {
                            inviteId: '54321',
                            email: 'newaddress@email.com',
                            phoneNumber: '07868787786'
                        }
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'text/plain'},
                        body: '54321'
                    }
                })
            );

            it('successfully updates contact details', (done) => {
                const inviteDataClient = new InviteData('http://localhost:' + MOCK_SERVER_PORT, ctx.sessionID);
                const data = {
                    inviteId: '54321',
                    email: 'newaddress@email.com',
                    phoneNumber: '07868787786'
                };
                const verificationPromise = inviteDataClient.updateContactDetails('123456', data, ctx);
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });

    });
    describe('when a request to delete an executor invite details', () => {
        describe('is required from a POST', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'probate_orchestrator_service deletes the invite details',
                    uponReceiving: 'a request to PUT to delete invite details',
                    withRequest: {
                        method: 'POST',
                        path: '/invite/delete/123456',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.serviceAuthorization
                        },
                        body: {
                            inviteId: '54321',
                            agreed: 'optionYes',
                            email: 'newaddress@email.com',
                            phoneNumber: '07868787786'
                        }
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                        body: '123456'
                    }
                })
            );

            it('successfully deletes invitation', (done) => {
                const inviteDataClient = new InviteData('http://localhost:' + MOCK_SERVER_PORT, ctx.sessionID);
                const data = {
                    inviteId: '54321',
                    agreed: 'optionYes',
                    email: 'newaddress@email.com',
                    phoneNumber: '07868787786'
                };
                const req = {
                    sessionID: 'someSessionId',
                    authToken: 'authToken',
                    session: {
                        serviceAuthorization: 'serviceAuthToken'
                    }
                };
                const verificationPromise = inviteDataClient.delete('123456', data, req);
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });

    });
    // Write pact files
    after(() => {
        return provider.finalize();
    });
});
