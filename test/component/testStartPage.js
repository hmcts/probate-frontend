const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist/index');
const {expect} = require('chai');

describe('start-page', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    describe('Verify Content, Errors and Redirection', () => {
        beforeEach(() => {
            testWrapper = new TestWrapper('StartPage');
        });

        afterEach(() => {
            testWrapper.destroy();
        });

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });

        it(`test it redirects to next page: ${expectedNextUrlForTaskList}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForTaskList);
        });

    });

    it('test page renders without being redirected to idam', (done) => {
        const request = require('supertest');
        const server = new (require('app').init)();
        const agent = request.agent(server.app);
        agent.get('/start-page')
            .expect('Content-type', /html/)
            .expect(200)
            .end((err, res) => {
                server.http.close();
                if (err) {
                    done(err);
                } else {
                    const text = res.text.toLowerCase();
                    expect(text).to.contain('use this service to apply for probate');
                    done();
                }
            });
    }).timeout(5000);
});
