'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const Oauth2Token = require('app/services/Oauth2Token');
const config = require('config');
const {URLSearchParams} = require('url');
const AsyncFetch = require('app/utils/AsyncFetch');

describe('Oauth2TokenService', () => {
    describe('post()', () => {
        const endpoint = '';
        const code = 'authcode';
        const redirectUri = `${endpoint}/oauth`;
        const clientName = config.services.idam.probate_oauth2_client;
        const secret = config.services.idam.probate_oauth2_secret;

        it('should call log() and fetchJson()', (done) => {
            const expectedParams = new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
            });
            const expectedFetchOptions = {
                method: 'POST',
                timeout: 10000,
                body: expectedParams.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${clientName}:${secret}`).toString('base64')}`
                }
            };
            const oauth2Token = new Oauth2Token(endpoint, 'abc123');
            const logSpy = sinon.spy(oauth2Token, 'log');
            const fetchJsonSpy = sinon.stub(AsyncFetch, 'fetchJson');

            oauth2Token.post(code, redirectUri);

            expect(oauth2Token.log.calledOnce).to.equal(true);
            expect(oauth2Token.log.calledWith('Post oauth2 token')).to.equal(true);
            expect(AsyncFetch.fetchJson.calledOnce).to.equal(true);
            expect(AsyncFetch.fetchJson.calledWith(endpoint + config.services.idam.probate_oauth_token_path, expectedFetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            done();
        });
    });
});
