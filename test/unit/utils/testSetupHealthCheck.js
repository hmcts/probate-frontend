'use strict';
const healthcheck = require('@hmcts/nodejs-healthcheck');
const setupHealthCheck = require('app/utils/setupHealthCheck');
const config = require('config');
const modulePath = 'app/utils';
const sinon = require('sinon');
const assert = require('sinon').assert;
const expect = require('chai').expect;
const outputs = require('@hmcts/nodejs-healthcheck/healthcheck/outputs');
const FormatUrl = require('app/utils/FormatUrl');
const logger = require('app/components/logger')('Init');
const app = {};
let res = {};

describe(modulePath, () => {
    beforeEach(() => {
        app.get = sinon.stub();
        sinon.stub(healthcheck, 'web');
        sinon.stub(healthcheck, 'raw');
        sinon.stub(healthcheck, 'status');
        sinon.stub(logger, 'error');
        sinon.stub(outputs, 'up');
        res = {status: 200};
    });

    afterEach(() => {
        healthcheck.web.restore();
        healthcheck.raw.restore();
        healthcheck.status.restore();
        logger.error.restore();
        outputs.up.restore();
    });

    it('set up health check endpoint', () => {
        setupHealthCheck(app);
        assert.calledWith(app.get, config.endpoints.health);
    });
    describe('validation-service', () => {
        it('passes health check', () => {
            setupHealthCheck(app);
            const call0 = healthcheck.web.getCall(0);
            const callArgs = call0.args;
            expect(callArgs[0]).contains('/health');
            const cosCallback = callArgs[1].callback;
            cosCallback(null, res);
            assert.called(outputs.up);
        });

        it('log error if health check fails for validation-service', () => {
            setupHealthCheck(app);
            const callArgs = healthcheck.web.getCall(0).args;
            expect(callArgs[0]).contains('/health');
            const cosCallback = callArgs[1].callback;
            res = {status: 500};
            cosCallback('error', res);
            assert.calledOnce(logger.error);
        });
    });
    describe('case-orchestration-service', () => {
        let formatUrlStub;
        beforeEach(() => {
            formatUrlStub = sinon.stub(FormatUrl, 'format').returns('/orchestrator-endpoint/health');
        });

        afterEach(() => {
            formatUrlStub.restore();
        });

        it('passes health check', () => {
            setupHealthCheck(app);

            const callArgs = healthcheck.web.getCall(1).args;

            // check we are testing correct service
            expect(callArgs[0]).to.eql('/orchestrator-endpoint/health');

            const cosCallback = callArgs[1].callback;
            cosCallback(null, res);
            assert.called(outputs.up);
        });

        it('log error if health check fails for case-orchestration-service', () => {
            setupHealthCheck(app);

            const callArgs = healthcheck.web.getCall(1).args;

            // check we are testing correct service
            expect(callArgs[0]).to.eql('/orchestrator-endpoint/health');

            const cosCallback = callArgs[1].callback;
            res = {status: 500};
            cosCallback('error', res);

            assert.calledOnce(logger.error);
        });
    });

});
