'use strict';

const {expect} = require('chai');
const normalizeNonIdamPages = require('app/utils/configNormalisers.js');

describe('normalizeNonIdamPages', () => {
    it('returns the same array instance when input is an array', () => {
        const arr = ['health/*', 'error'];
        const result = normalizeNonIdamPages(arr);
        expect(result).to.equal(arr);
    });

    it('parses a valid JSON array string', () => {
        const input = '["health/*","error","pin"]';
        const result = normalizeNonIdamPages(input);
        expect(result).to.deep.equal(['health/*', 'error', 'pin']);
    });

    it('throws with clear message for invalid JSON', () => {
        const input = '[\'health/*\',\'error\']';
        expect(() => normalizeNonIdamPages(input))
            .to.throw('NON_IDAM_PAGES is not valid JSON');
    });

    it('throws when JSON parses but is not an array (object)', () => {
        const input = '{"a":1}';
        expect(() => normalizeNonIdamPages(input))
            .to.throw('Missing or invalid NON_IDAM_PAGES configuration. Aborting startup.');
    });

    it('throws when JSON parses but is not an array (string)', () => {
        const input = '"health/*,error"';
        expect(() => normalizeNonIdamPages(input))
            .to.throw('Missing or invalid NON_IDAM_PAGES configuration. Aborting startup.');
    });

    it('throws when input is an empty string', () => {
        expect(() => normalizeNonIdamPages(''))
            .to.throw('Missing or invalid NON_IDAM_PAGES configuration. Aborting startup.');
    });

    it('throws when input is whitespace only', () => {
        expect(() => normalizeNonIdamPages('   '))
            .to.throw('Missing or invalid NON_IDAM_PAGES configuration. Aborting startup.');
    });

    it('throws when input is undefined', () => {
        // eslint-disable-next-line no-undefined
        expect(() => normalizeNonIdamPages(undefined))
            .to.throw('Missing or invalid NON_IDAM_PAGES configuration. Aborting startup.');
    });

    it('throws when input is a non-string primitive (number/boolean)', () => {
        expect(() => normalizeNonIdamPages(42))
            .to.throw('Missing or invalid NON_IDAM_PAGES configuration. Aborting startup.');
        expect(() => normalizeNonIdamPages(false))
            .to.throw('Missing or invalid NON_IDAM_PAGES configuration. Aborting startup.');
    });
});
