/**
 * The following example is for Pact version 5
 */
const path = require('path');
const chai = require('chai');
const {Pact, Matchers} = require('@pact-foundation/pact');
const {somethingLike, like} = Matchers;
const chaiAsPromised = require('chai-as-promised');
const FeesLookup = require('app/services/FeesLookup');
const config = require('config');
const assert = chai.assert;
chai.use(chaiAsPromised);

describe('Pact FeesRegisterClient', () => {
    const MOCK_SERVER_PORT = 4411;
    const provider = new Pact({
        consumer: 'probate_frontend',
        provider: 'feeRegister_lookUp',
        port: MOCK_SERVER_PORT,
        log: path.resolve(process.cwd(), 'logs', 'pactFeesRegister.log'),
        dir: path.resolve(process.cwd(), config.services.pact.pactDirectory),
        logLevel: 'INFO',
        spec: 2
    });
    const ctx = {
        sessionID: 'someSessionId',
        authToken: 'authToken',
        session: {
            serviceAuthorization: 'someServiceAuthorization'
        }
    };

    const session = {
        featureToggles: {'ft_newfee_register_code': true}
    };

    const feeParametersIssueDataOverMinThreshold = {
        amount_or_volume: 5001,
        applicant_type: 'all',
        channel: 'default',
        event: 'issue',
        jurisdiction1: 'family',
        jurisdiction2: 'probate+registry',
        keyword: 'SA',
        service: 'probate'
    };

    const feeParametersIssueDataBelowMinThreshold = {
        amount_or_volume: 5000,
        applicant_type: 'all',
        channel: 'default',
        event: 'issue',
        jurisdiction1: 'family',
        jurisdiction2: 'probate+registry',
        keyword: 'SAL5K',
        service: 'probate'
    };

    const feeParametersCopiesData = {
        amount_or_volume: 3,
        applicant_type: 'all',
        channel: 'default',
        event: 'copies',
        jurisdiction1: 'family',
        jurisdiction2: 'probate+registry',
        keyword: 'GrantWill',
        service: 'probate'
    };

    const feeResponseBodyExpectationIssueDataOverMinThreshold = {
        fee_amount: like(273.00),
        code: somethingLike('FEE0219'),
        description: 'Application for a grant of probate (Estate over 5000 GBP)',
        version: like(5),
    };

    const feeResponseBodyExpectationIssueDataBelowMinThreshold = {
        fee_amount: like(0),
        code: somethingLike('FEE0220'),
        description: 'Application for a grant of probate (Estate under 5000 GBP)',
        version: like(3),
    };

    const feeResponseBodyExpectationCopiesData = {
        fee_amount: like(4.50),
        code: somethingLike('FEE0546'),
        description: 'Copy of a document (for each copy)',
        version: like(1),
    };

    function getRequestQuery(feesRegisterData) {
        const amountOrVolume = 'amount_or_volume=' + feesRegisterData.amount_or_volume;
        const applicantType = 'applicant_type=' + feesRegisterData.applicant_type;
        const channel = 'channel=' + feesRegisterData.channel;
        const event = 'event=' + feesRegisterData.event;
        const jurisdiction1 = 'jurisdiction1=' + feesRegisterData.jurisdiction1;
        const jurisdiction2 = 'jurisdiction2=' + feesRegisterData.jurisdiction2;
        const keyword = 'keyword=' + feesRegisterData.keyword;
        const service = 'service=' + feesRegisterData.service;
        return amountOrVolume + '&' + applicantType + '&' + channel + '&' + event + '&' + jurisdiction1 + '&' + jurisdiction2 + '&' + keyword + '&' + service;
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

    describe('when a request for a probate PA over min threshold Fee', () => {
        describe('is required from a GET', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'service is registered in Fee registry',
                    uponReceiving: 'a request to GET amount over min threshold fee',
                    withRequest: {
                        method: 'GET',
                        path: '/fees-register/fees/lookup',
                        query: getRequestQuery(feeParametersIssueDataOverMinThreshold),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.serviceAuthorization
                        }
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                        body: feeResponseBodyExpectationIssueDataOverMinThreshold
                    }
                })
            );

            it('successfully returns fee for PA over min threshold', (done) => {
                const issuesData = config.services.feesRegister.newfee_issuesData;
                issuesData.amount_or_volume = 5001;
                const feeLookupClient = new FeesLookup(config.services.feesRegister.url, session);
                const verificationPromise = feeLookupClient.get(issuesData, ctx);
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });
    });

    describe('when a request for a probate PA below min threshold Fee', () => {
        describe('is required from a GET', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'service is registered in Fee registry',
                    uponReceiving: 'a request to GET amount below min threshold fee',
                    withRequest: {
                        method: 'GET',
                        path: '/fees-register/fees/lookup',
                        query: getRequestQuery(feeParametersIssueDataBelowMinThreshold),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.serviceAuthorization
                        }
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                        body: feeResponseBodyExpectationIssueDataBelowMinThreshold
                    }
                })
            );

            it('successfully returns fee for PA below min threshold', (done) => {
                const issuesDataIhtMinAmount = config.services.feesRegister.newfee_issuesDataIhtMinAmount;
                issuesDataIhtMinAmount.amount_or_volume = 5000;
                const feeLookupClient = new FeesLookup(config.services.feesRegister.url, session);
                const verificationPromise = feeLookupClient.get(issuesDataIhtMinAmount, ctx);
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });
    });

    describe('when a request for a probate PA copies Fee', () => {
        describe('is required from a GET', () => {
            before(() =>
                provider.addInteraction({
                    // The 'state' field specifies a 'Provider State'
                    state: 'service is registered in Fee registry',
                    uponReceiving: 'a request to GET copies fee',
                    withRequest: {
                        method: 'GET',
                        path: '/fees-register/fees/lookup',
                        query: getRequestQuery(feeParametersCopiesData),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ctx.authToken,
                            'ServiceAuthorization': ctx.serviceAuthorization
                        }
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {'Content-Type': 'application/json'},
                        body: feeResponseBodyExpectationCopiesData
                    }
                })
            );

            it('successfully returns fee for copies', (done) => {
                const copiesData = config.services.feesRegister.newfee_copiesData;
                copiesData.amount_or_volume = 3;
                const feeLookupClient = new FeesLookup(config.services.feesRegister.url, session);
                const verificationPromise = feeLookupClient.get(copiesData, ctx);
                assert.eventually.ok(verificationPromise).notify(done);
            });
        });
    });

    // Write pact files
    after(() => {
        return provider.finalize();
    });

});
