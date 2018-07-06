const TestWrapper = require('test/util/TestWrapper');
const services = require('app/components/services');
const sinon = require('sinon');
const {expect} = require('chai');
const commonContent = require('app/resources/en/translation/common');

describe('co-applicant-start-page', () => {
    let testWrapper, checkAllAgreedStub;

    describe('Verify Content, Errors and Redirection', () => {
        beforeEach(() => {
            testWrapper = new TestWrapper('CoApplicantStartPage');
            checkAllAgreedStub = sinon.stub(services, 'checkAllAgreed');
        });

        afterEach(() => {
            testWrapper.destroy();
            checkAllAgreedStub.restore();
        });

        it('test correct content is loaded on the page', (done) => {
            checkAllAgreedStub.returns(Promise.resolve('false'));
            const sessionData = {
                'applicant': {
                    'firstName': 'john', 'lastName': 'theapplicant'
                },
                'deceased': {
                    'firstName': 'dave', 'lastName': 'bassett'
                },
                'pin': '12345'
            };

            const excludeKeys = [];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {

                    const contentData = {
                        leadExecutorName: 'john theapplicant',
                        deceasedName: 'dave bassett',
                        pin: ''
                    };
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
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
        server.useIDAM = 'true';
        const agent = request.agent(server.app);
        agent.get('/co-applicant-start-page')
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
