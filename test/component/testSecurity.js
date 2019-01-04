'use strict';

const {expect} = require('chai');
const request = require('supertest');
const app = require('app');
const config = require('app/config');
const oAuth2CallbackUrl = config.services.idam.probate_oauth_callback_path;
const oAuth2TokenUrl = config.services.idam.probate_oauth_token_path;
const TaskList = require('app/steps/ui/tasklist/index');
const nock = require('nock');

describe('security', () => {
    const LOGIN_URL = 'https://localhost:8000/login';
    const expectedNextUrlForTaskList = TaskList.getUrl();

    it(`Redirects to login when idam returns 401 from Oauth2Token.post() request: ${LOGIN_URL}`, (done) => {
        nock(config.services.idam.apiUrl)
            .post(oAuth2TokenUrl)
            .reply(401, new Error('Unauthorized'));

        const server = app.init();
        const agent = request.agent(server.app);
        agent.get(oAuth2CallbackUrl)
            .set('Cookie', [`__redirect=${JSON.stringify({state: 'testState'})}`])
            .query({code: 12345})
            .query({state: 'testState'})
            .expect(302)
            .end((err, res) => {
                server.http.close();
                nock.cleanAll();
                if (err) {
                    done(err);
                } else {
                    expect(res.headers.location).to.contain(LOGIN_URL);
                    done();
                }
            });
    }).timeout(5000);

    it('Displays an error page when when a error other than 401 is returned from Oauth2Token.post() request', (done) => {
        const server = app.init();
        const agent = request.agent(server.app);
        agent.get(oAuth2CallbackUrl)
            .set('Cookie', [`__redirect=${JSON.stringify({state: 'testState'})}`])
            .query({code: 12345})
            .query({state: 'testState'})
            .expect('Content-type', /html/)
            .expect(403)
            .end((err, res) => {
                server.http.close();
                if (err) {
                    done(err);
                } else {
                    const text = res.text.toLowerCase();
                    expect(text).to.contain('not authorised');
                    done();
                }
            });
    }).timeout(5000);

    it(`Redirects to login if __auth-token does not contain current payloadVersion: ${LOGIN_URL}`, (done) => {
        config.app.useIDAM = 'true';
        const server = app.init();
        const agent = request.agent(server.app);
        agent.get(expectedNextUrlForTaskList)
            .set('Cookie', ['__auth-token-v2.5.0=dummyToken'])
            .expect(302)
            .end((err, res) => {
                server.http.close();
                config.app.useIDAM = 'false';
                if (err) {
                    done(err);
                } else {
                    expect(res.headers.location).to.contain(LOGIN_URL);
                    done();
                }
            });
    }).timeout(5000);
});
