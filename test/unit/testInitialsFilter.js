const initialsFilter = require('app/components/initialsFilter');
const assert = require('chai').assert;

describe('initialsFilter', () => {
    it('creates initials from a one word string', () => {
        const input = 'First';
        const output = initialsFilter(input);
        assert.equal(output, 'F');
    });

    it('handles an empty string', () => {
        const input = '';
        const output = initialsFilter(input);
        assert.equal(output, '');
    });

    it('handles a string with two words', () => {
        const input = 'First Second';
        const output = initialsFilter(input);
        assert.equal(output, 'F S');
    });

    it('handles a string with five words', () => {
        const input = 'First Second Third Fourth Fifth';
        const output = initialsFilter(input);
        assert.equal(output, 'F S T F F');
    });

    it('handles a string with multiple spaces', () => {
        const input = '   First    Second   ';
        const output = initialsFilter(input);
        assert.equal(output, 'F S');
    });

    it('handles a string with special characters', () => {
        const input = 'Billie-Jean, Micheal & Paul';
        const output = initialsFilter(input);
        assert.equal(output, 'B J M P');
    });
});
