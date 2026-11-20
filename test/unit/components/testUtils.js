const {getStore} = require('../../../app/components/utils');
const {commonNext, commonRes} = require('../../util/commonConsts');
const expect = require('chai').expect;
const proxyquire = require('proxyquire');

describe('utils', () => {
    let res;
    let next;

    beforeEach(() => {
        res = commonRes;
        next = commonNext;
    });

    afterEach(() => {
        res.send.reset();
        res.set.reset();
        res.sendStatus.reset();
        res.redirect.reset();
        next.reset();
    });

    describe('getStore', () => {
        it('redis disabled', () => {
            const result = getStore({enabled: 'false'}, 100000);
            expect(result.constructor.name).to.equal('MemoryStore');
        });

        it('retains the raw ioredis client on the RedisStore instance', () => {
            const rawRedisClient = {eval: () => {}};
            class FakeRedisStore {
                constructor(options) {
                    this.client = {
                        get: () => {},
                        set: () => {},
                        del: () => {}
                    };
                    this.options = options;
                }
            }
            const utils = proxyquire('../../../app/components/utils', {
                'ioredis': function Redis() {
                    return rawRedisClient;
                },
                'connect-redis': {
                    RedisStore: FakeRedisStore
                }
            });

            const result = utils.getStore({enabled: 'true', useTLS: 'false'}, 100000);

            expect(result.redisClient).to.equal(rawRedisClient);
            expect(result.client.eval).to.equal(undefined);
            expect(result.options.client).to.equal(rawRedisClient);
        });
    });
});
