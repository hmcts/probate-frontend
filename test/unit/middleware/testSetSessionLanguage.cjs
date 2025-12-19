'use strict';

const setSessionLanguage = require('../../../app/middleware/setSessionLanguage.cjs');

const {assert} = require('chai');
const sinon = require('sinon');

describe('SetSessionLanguage', () => {
    let req;
    let res;
    let next;

    const preset = {'preset': null};
    const en = 'en';
    const cy = 'cy';
    // we do not support french
    const invalid = 'fr';

    beforeEach(() => {
        res = {};
        req = {
            session: {
                language: null,
            },
            query: null,
        };
        next = sinon.spy();
    });

    describe('setSessionLanguage()', () => {

        it('should default session lang to en if no value is set in the request or the query', () => {
            setSessionLanguage(req, res, next);
            assert.equal(req.session.language, en);
        });

        it('should leave session lang set if no value in the query', () => {
            req.session.language = preset;
            setSessionLanguage(req, res, next);
            assert.equal(req.session.language, preset);
        });

        it('should not override session lang if query lng value invalid', () => {
            req.session.language = preset;
            req.query = {lng: invalid};
            setSessionLanguage(req, res, next);
            assert.equal(req.session.language, preset);
        });

        it('should not override session lang if query lng array all invalid', () => {
            req.session.language = preset;
            req.query = {lng: [invalid, invalid]};
            setSessionLanguage(req, res, next);
            assert.equal(req.session.language, preset);
        });

        it('should override session lang to valid query lng value', () => {
            req.session.language = preset;
            req.query = {lng: cy};
            setSessionLanguage(req, res, next);
            assert.equal(req.session.language, cy);
        });

        it('should override session lang to first valid query lng array value', () => {
            req.session.language = preset;
            req.query = {lng: [invalid, cy]};
            setSessionLanguage(req, res, next);
            assert.equal(req.session.language, cy);
        });

        //

        it('should not override session lang if query locale value invalid', () => {
            req.session.language = preset;
            req.query = {locale: invalid};
            setSessionLanguage(req, res, next);
            assert.equal(req.session.language, preset);
        });

        it('should not override session lang if query locale array all invalid', () => {
            req.session.language = preset;
            req.query = {locale: [invalid, invalid]};
            setSessionLanguage(req, res, next);
            assert.equal(req.session.language, preset);
        });

        it('should override session lang to valid query locale value', () => {
            req.session.language = preset;
            req.query = {locale: cy};
            setSessionLanguage(req, res, next);
            assert.equal(req.session.language, cy);
        });

        it('should override session lang to first valid query locale array value', () => {
            req.session.language = preset;
            req.query = {locale: [invalid, cy]};
            setSessionLanguage(req, res, next);
            assert.equal(req.session.language, cy);
        });

        it('should use query lng value rather than query locale value', () => {
            req.session.language = preset;
            req.query = {
                lng: en,
                locale: cy,
            };
            setSessionLanguage(req, res, next);
            assert.equal(req.session.language, en);
        });
    });
});
