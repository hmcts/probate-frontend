'use strict';

const {assert} = require('chai');
const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const express = require('express');
const helmet = require('helmet');
const request = require('supertest');

const app = proxyquire('app', {
    'express': express,
    'helmet': helmet,
});

describe('app-config-helmet', () => {
    it('should use helmet.strictTransportSecurity with appropriate maxAge', (done) => {
        const stsSpy = sinon.spy(helmet, 'strictTransportSecurity');

        const server = app.init();
        server.http.close();

        stsSpy.restore();

        const expectedMinimumMaxAge = 31536000;
        const seenAges = [];

        assert(
            stsSpy.calledWith(
                sinon.match.has('maxAge', sinon.match((val) => {
                    seenAges.push(val);
                    return val >= expectedMinimumMaxAge;
                }))),
            `strictTransportSecurity not called with maxAge >= ${expectedMinimumMaxAge}, saw ${seenAges.join()}`);

        const called = stsSpy.callCount;
        assert.equal(called, 1,
            `Expected strictTransportSecurity to be called once but was called ${called} times`);

        done();
    });

    it('should set permissions-policy and avoid deprecated client-side headers', (done) => {
        const server = app.init();

        request(server.app)
            .get('/health')
            .end((err, res) => {
                server.http.close();
                if (err) {
                    return done(err);
                }

                expect(res.headers['permissions-policy']).to.equal('geolocation=(), camera=(), microphone=()');
                // eslint-disable-next-line no-undefined
                expect(res.headers['x-frame-options']).to.equal(undefined);
                // eslint-disable-next-line no-undefined
                expect(res.headers['x-xss-protection']).to.equal(undefined);

                return done();
            });
    });

    it('should use nonce-based script-src policy without unsafe-inline', (done) => {
        const server = app.init();

        request(server.app)
            .get('/health')
            .end((err, res) => {
                server.http.close();
                if (err) {
                    return done(err);
                }

                const csp = res.headers['content-security-policy'];
                const expectedScriptSrcPrefix = [
                    'script-src',
                    '\'self\'',
                    '\'sha256-GUQ5ad8JK5KmEWmROf3LZd9ge94daqNvd8xy9YS1iDw=\'',
                    '\'sha256-AaA9Rn5LTFZ5vKyp3xOfFcP4YbyOjvWn2up8IKHVAKk=\'',
                    '\'sha256-G29/qSW/JHHANtFhlrZVDZW1HOkCDRc78ggbqwwIJ2g=\'',
                    '\'sha256-BWhcmwio/4/QdqKNw5PKmTItWBjkevCaOUbLkgW5cHs=\'',
                    '\'sha256-L7viC3kUpXu9uCOi97VqCR2bLlMwSQlmLmSuuQ93ngU=\'',
                    '\'sha256-nWZRr0RF4OANYiYcCteeOrMWiiSKIEIE+qPfFTq/WyI=\'',
                    '*.google-analytics.com',
                    'https://*.dynatrace.com',
                    '*.googletagmanager.com',
                    'tagmanager.google.com',
                    'kerv-genesys-base-url',
                    '\'strict-dynamic\'',
                    '\'nonce-'
                ].join(' ');
                expect(csp).to.contain(expectedScriptSrcPrefix);

                return done();
            });
    });

    it('should rotate nonce for each request', (done) => {
        const server = app.init();

        request(server.app)
            .get('/health')
            .end((firstErr, firstRes) => {
                if (firstErr) {
                    server.http.close();
                    return done(firstErr);
                }

                request(server.app)
                    .get('/health')
                    .end((secondErr, secondRes) => {
                        server.http.close();
                        if (secondErr) {
                            return done(secondErr);
                        }

                        const firstNonce = (firstRes.headers['content-security-policy'] || '').match(/'nonce-([^']+)'/);
                        const secondNonce = (secondRes.headers['content-security-policy'] || '').match(/'nonce-([^']+)'/);

                        // eslint-disable-next-line no-unused-expressions
                        expect(firstNonce && firstNonce[1]).to.exist;
                        // eslint-disable-next-line no-unused-expressions
                        expect(secondNonce && secondNonce[1]).to.exist;
                        expect(firstNonce[1]).to.not.equal(secondNonce[1]);

                        return done();
                    });
            });
    });
});
