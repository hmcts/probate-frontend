const expect = require('chai').expect;
const {cloneDeep} = require('lodash');
const config = require('config');
const sinon = require('sinon');
const rewire = require('rewire');
const SetupSecrets = rewire('../../app/setupSecrets');

const modulePath = 'app/setupSecrets';

let mockConfig = {};

describe(modulePath, () => {
    const originalEnv = process.env.NODE_ENV;
    describe('#setup', () => {
        beforeEach(() => {
            process.env.NODE_ENV = originalEnv;
            mockConfig = cloneDeep(config);
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should set local config values when environment is dev-aat', () => {
            process.env.NODE_ENV = 'dev-aat';
            const setLocalSecretStub = sinon.stub(SetupSecrets.prototype, 'setLocalSecret');
            new SetupSecrets().setupSecrets();
            sinon.assert.callCount(setLocalSecretStub, 7);
        });

        it('should not set local config values when environment is not dev-aat', () => {
            const setLocalSecretStub = sinon.stub(SetupSecrets.prototype, 'setLocalSecret');
            new SetupSecrets().setupSecrets();
            sinon.assert.callCount(setLocalSecretStub, 0);
        });

        it('should set config values when secrets path is set', () => {
            mockConfig.secrets = {
                probate: {
                    'frontend-redis-access-key': 'redisValue',
                    'idam-s2s-secret': 'idamValue',
                }
            };

            // Update config with secret setup
            const restore = SetupSecrets.__set__('config', mockConfig);
            new SetupSecrets().setupSecrets();

            expect(mockConfig.redis.password)
                .to.equal(mockConfig.secrets.probate['frontend-redis-access-key']);
            expect(mockConfig.services.idam.service_key)
                .to.equal(mockConfig.secrets.probate['idam-s2s-secret']);
            restore();
        });

        it('should not set config values when secrets path is not set', () => {
            // Update config with secret setup
            mockConfig.secrets = {
                probate: {
                }
            };
            const restore = SetupSecrets.__set__('config', mockConfig);
            new SetupSecrets().setupSecrets();

            expect(mockConfig.redis.secret)
                .to.equal('OVERWRITE_THIS');
            restore();
        });

        it('should only set one config value when single secret path is set', () => {
            mockConfig.secrets = {
                probate: {
                    'idam-s2s-secret': 'idamValue',
                }
            };

            // Update config with secret setup
            const restore = SetupSecrets.__set__('config', mockConfig);
            new SetupSecrets().setupSecrets();

            expect(mockConfig.redis.secret)
                .to.equal('OVERWRITE_THIS');
            expect(mockConfig.services.idam.service_key)
                .to.equal(mockConfig.secrets.probate['idam-s2s-secret']);
            restore();
        });
    });
});
