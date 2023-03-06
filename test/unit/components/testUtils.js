const {getStore} = require('../../../app/components/utils');
const {commonNext, commonRes} = require('../../util/commonConsts');
const session = require('express-session');
const expect = require('chai').expect;

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
            const result = getStore({enabled: 'false'}, session, 100000);
            expect(result.constructor.name).to.equal('MemoryStore');
        });
    });
});
