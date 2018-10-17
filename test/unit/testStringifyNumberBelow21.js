const utils = require('app/components/utils');
const assert = require('chai').assert;

describe('Test stringifyNumberBelow21', function () {

    it('Gives first for 0', function () {

        const word = utils.stringifyNumberBelow21(0);

        assert.equal(word, 'first');
    });

    it('Gives tenth for 9', function () {

        const word = utils.stringifyNumberBelow21(9);

        assert.equal(word, 'tenth');
    });

    it('Gives twentieth for 19', function () {

        const word = utils.stringifyNumberBelow21(19);

        assert.equal(word, 'twentieth');
    });

    it('Gives undefined for -ve value', function () {

        const word = utils.stringifyNumberBelow21(-1);
        assert.isUndefined(word);
    });

    it('Gives undefined for value greater than max allowed (19)', function () {

        const word = utils.stringifyNumberBelow21(20);
        assert.isUndefined(word);
    });

    it('Gives undefined for decimal value', function () {

        const word = utils.stringifyNumberBelow21(10.5);
        assert.isUndefined(word);
    });

    it('Gives undefined for null value', function () {

        const word = utils.stringifyNumberBelow21(null);
        assert.isUndefined(word);
    });
});
