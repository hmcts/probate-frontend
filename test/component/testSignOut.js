'use strict';
const TestWrapper = require('test/util/TestWrapper');
const commonContent = require('app/resources/en/translation/common');
const {expect} = require('chai');

describe('sign-out', () => {
    let testWrapper;

    describe('Verify Content, Errors and Redirection', () => {
        beforeEach(() => {
            testWrapper = new TestWrapper('SignOut');
        });

        afterEach(() => {
            testWrapper.destroy();
        });

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys, {});
        });

        it('test save and close link is not displayed on the page', (done) => {
            const playbackData = {};
            playbackData.saveAndClose = commonContent.saveAndClose;

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });

    it('test page renders without being redirected to idam', (done) => {
        const request = require('supertest');
        const server = new (require('app').init)();
        const agent = request.agent(server.app);
        agent.get('/sign-out')
            .expect('Content-type', /html/)
            .expect(200)
            .end((err, res) => {
                server.http.close();
                if (err) {
                    done(err);
                } else {
                    const text = res.text.toLowerCase();
                    expect(text).to.contain('you&rsquo;ve signed out');
                    done();
                }
            });
    }).timeout(5000);
});
