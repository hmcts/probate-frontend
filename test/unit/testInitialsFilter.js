const initialsFilter = require('app/components/initialsFilter');
const assert = require('chai').assert;

describe('initialsFilter', function () {

    it('creates initials from a one word string', function () {
        const input = 'First';
        const output = initialsFilter(input);
        assert.equal(output, 'F');
    });

    it('handles an empty string', function () {
        const input = '';
        const output = initialsFilter(input);
        assert.equal(output, '');
    });

    it('handles a string with two words', function () {
        const input = 'First Second';
        const output = initialsFilter(input);
        assert.equal(output, 'F S');
    });

    it('handles a string with five words', function () {
        const input = 'First Second Third Fourth Fifth';
        const output = initialsFilter(input);
        assert.equal(output, 'F S T F F');
    });

    it('handles a string with multiple spaces', function () {
        const input = '   First    Second   ';
        const output = initialsFilter(input);
        assert.equal(output, 'F S');
    });

    it('handles a string with special characters', function () {
        const input = 'Billie-Jean, Micheal & Paul';
        const output = initialsFilter(input);
        assert.equal(output, 'B J M P');
    });
});
