'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const config = require('config');
const logger = require('app/components/logger');
const PostcodeLookup = require('app/services/PostcodeLookup');


describe('PostcodeLookup', () => {
    let postcodeLookup;
    let axiosGetStub;
    let loggerErrorStub;
    let loggerInfoStub;
    let loggerInstanceStub;

    beforeEach(() => {
        // Setup logger stubs to prevent console clutter and verify logging behavior
        loggerErrorStub = sinon.stub();
        loggerInfoStub = sinon.stub();
        loggerInstanceStub = sinon.stub(logger, 'constructor').returns({
            error: loggerErrorStub,
            info: loggerInfoStub
        });
        // Alternate stubbing if logger is a plain high-order function rather than a class:
        // sinon.stub(logger, 'default' in logger ? 'default' : logger);
        // For standard high-order functions, we can safely stub the main export like this:
        loggerInstanceStub = sinon.stub().returns({
            error: loggerErrorStub,
            info: loggerInfoStub
        });

        // Mocking config values
        config.services = {
            postcode: {
                url: 'https://api.postcode-service.com',
                token: 'mock-token'
            }
        };

        // Stub axios.get
        axiosGetStub = sinon.stub(axios, 'get');

        postcodeLookup = new PostcodeLookup();
    });

    afterEach(() => {
        // Restore all stubs to avoid polluting other tests
        sinon.restore();
    });

    describe('get', () => {
        const samplePostcode = 'SW1A 1AA';

        it('should successfully fetch and format postcode addresses', async () => {
            const mockAxiosResponse = {
                data: {
                    results: [
                        {
                            DPA: {
                                ADDRESS: '10 Downing Street, London',
                                POSTCODE: 'SW1A 1AA'
                            }
                        },
                        {
                            DPA: {
                                ADDRESS: '11 Downing Street, London',
                                POSTCODE: 'SW1A 1AA'
                            }
                        }
                    ]
                }
            };

            axiosGetStub.resolves(mockAxiosResponse);

            const result = await postcodeLookup.get(samplePostcode);

            // Assert axios call structure
            expect(axiosGetStub.calledOnce).to.be.true;
            expect(axiosGetStub.firstCall.args[0]).to.equal('postcode');
            expect(axiosGetStub.firstCall.args[1]).to.deep.equal({
                baseURL: 'https://api.postcode-service.com',
                headers: { accept: 'application/json' },
                params: {
                    key: 'mock-token',
                    lr: 'EN',
                    postcode: samplePostcode
                }
            });

            // Assert formatting logic
            expect(result).to.have.lengthOf(2);
            expect(result[0]).to.deep.equal({
                formattedAddress: '10 Downing Street, London',
                postcode: 'SW1A 1AA'
            });
        });

        it('should return an empty array if no results are found in the response data', async () => {
            const mockAxiosResponse = { data: {} }; // No results key
            axiosGetStub.resolves(mockAxiosResponse);

            const result = await postcodeLookup.get(samplePostcode);

            expect(result).to.be.an('array').that.is.empty;
        });

        it('should catch errors, log them, and return an empty array if the axios call rejects', async () => {
            const mockError = new Error('Network Error');
            axiosGetStub.rejects(mockError);

            const result = await postcodeLookup.get(samplePostcode);

            // Verify handling logic
            expect(result).to.be.an('array').that.is.empty;
        });
    });
});
