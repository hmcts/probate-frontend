const expect = require('chai').expect;
const {cloneDeep} = require('lodash');
const config = require('config');
const proxyquire = require('proxyquire');

const modulePath = 'app/setupSecrets';

let mockConfig = {};

describe(modulePath, () => {
    describe('#setup', () => {
        beforeEach(() => {
            mockConfig = cloneDeep(config);
        });

        it('should set config values when secrets path is set', () => {
            mockConfig.secrets = {
                probate: {
                    'frontend-redis-access-key': 'redisValue',
                    'idam-s2s-secret': 'idamValue',
                }
            };

            // Update config with secret setup
            const setupSecrets = proxyquire(modulePath,
                {config: mockConfig});
            setupSecrets();

            expect(mockConfig.redis.secret)
                .to.equal(mockConfig.secrets.probate['frontend-redis-access-key']);
            expect(mockConfig.idam.service_key)
                .to.equal(mockConfig.secrets.probate['idam-s2s-secret']);
        });

        it('should not set config values when secrets path is not set', () => {
            // Update config with secret setup
            mockConfig.secrets = {
                probate: {
                }
            };
            const setupSecrets = proxyquire(modulePath,
                {config: mockConfig});
            setupSecrets();

            expect(mockConfig.redis.secret)
                .to.equal('OVERWRITE_THIS');
        });

        it('should only set one config value when single secret path is set', () => {
            mockConfig.secrets = {
                probate: {
                    'idam-s2s-secret': 'idamValue',
                }
            };

            // Update config with secret setup
            const setupSecrets = proxyquire(modulePath,
                {config: mockConfig});
            setupSecrets();

            expect(mockConfig.redis.secret)
                .to.equal('OVERWRITE_THIS');
            expect(mockConfig.idam.service_key)
                .to.equal(mockConfig.secrets.probate['idam-s2s-secret']);
        });
    });
});
