'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const Oauth2Token = require('app/services/Oauth2Token');
const config = require('app/config');
const {URLSearchParams} = require('url');

describe('Oauth2TokenService', () => {
    describe('post()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = 'http://localhost';
            const code = 'authcode';
            const redirectUri = `${endpoint}/oauth`;
            const clientName = config.services.idam.probate_oauth2_client;
            const secret = config.services.idam.probate_oauth2_secret;
            const params = new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
            });
            const fetchOptions = {
                method: 'POST',
                timeout: 10000,
                body: params.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${new Buffer(`${clientName}:${secret}`).toString('base64')}`
                }
            };
            const oauth2Token = new Oauth2Token(endpoint, 'abc123');
            const logSpy = sinon.spy(oauth2Token, 'log');
            const fetchJsonSpy = sinon.spy(oauth2Token, 'fetchJson');

            oauth2Token.post(code, redirectUri);

            expect(oauth2Token.log.calledOnce).to.equal(true);
            expect(oauth2Token.log.calledWith('Post oauth2 token')).to.equal(true);
            expect(oauth2Token.fetchJson.calledOnce).to.equal(true);
            expect(oauth2Token.fetchJson.calledWith(endpoint + config.services.idam.probate_oauth_token_path, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            done();
        });
    });
});
