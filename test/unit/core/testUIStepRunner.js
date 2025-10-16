const UIStepRunner = require('app/core/runners/UIStepRunner');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const sinonChai = require('sinon-chai');
const DetectDataChange = require('app/wrappers/DetectDataChange');
chai.use(sinonChai);
const co = require('co');

describe('UIStepRunner', () => {
    const req = {
        session: {
            language: 'en',
            form: {
                declaration: {
                    declarationCheckbox: 'true'
                }
            },
            back: ['hello']
        }
    };
    const reqIsSaveAndClose = {
        session: {
            language: 'en',
            form: {
                declaration: {
                    declarationCheckbox: 'true'
                },
                isSaveAndClose: 'true'
            },
            back: ['hello']
        }
    };
    const req400 = {
        session: {
            language: 'en',
            regId: 'regid123',
            form: {
                caseType: 'gop',
                ccdCase: {
                    id: 1234567890123456,
                    state: 'Pending'
                }
            },
            back: ['hello']
        },
        userLoggedIn: true,
        log: {
            error: sinon.spy()
        }
    };
    it('declarationCheckbox should be false where hasDataChanged is true', (done) => {
        const stepName = 'test';
        const step = {
            name: stepName,
            validate: () => [false, []],
            getUrlWithContext: () => 'hello',
            getContextData: () => '',
            nextStepUrl: () => '',
            action: () => [{}, req.session.form],
            constructor: {
                getUrl: () => 'hello'
            }
        };
        const hasDataChangedStub = sinon.stub(DetectDataChange.prototype, 'hasDataChanged').returns(true);
        const expectedForm = {
            declarationCheckbox: 'false',
            hasDataChanged: true
        };
        const res = {
            redirect: (url) => url
        };

        const runner = new UIStepRunner();
        co(function* () {
            yield runner.handlePost(step, req, res);
            expect(req.session.form.declaration).to.deep.equal(expectedForm);
            expect(req.session.form.eventDescription).equal('Page completed: hello');
            hasDataChangedStub.restore();
            done();
        });

    });
    it('should redirect to /task-list as isSaveAndClose true', (done) => {
        const stepName = 'test';
        const step = {
            name: stepName,
            validate: () => [false, []],
            getUrlWithContext: () => 'hello',
            getContextData: () => ({'isSaveAndClose': 'true'}),
            nextStepUrl: () => '',
            action: () => [{}, req.session.form],
            constructor: {
                getUrl: () => 'hello'
            }
        };
        const resIsSaveAndClose = {
            redirect: sinon.spy()
        };
        const runner = new UIStepRunner();
        co(function* () {
            yield runner.handlePost(step, reqIsSaveAndClose, resIsSaveAndClose);
            sinon.assert.calledOnce(resIsSaveAndClose.redirect);
            expect(resIsSaveAndClose.redirect).to.have.been.calledWith('/task-list');
            done();
        });
    });
    it('should return an error on a 400 Bad Request', (done) => {
        const stepName = 'DeceasedAddress';
        const step = {
            name: stepName,
            template: 'ui/copies/uk/template',
            validate: () => [false, []],
            getUrlWithContext: () => 'hello',
            getContextData: () => '',
            nextStepUrl: () => '',
            action: () => [{}, req400.session.form],
            constructor: {
                getUrl: () => 'hello'
            },
            shouldPersistFormData: () => true,
            persistFormData: () => ({name: 'Error', message: 'xxxxxxx'}),
            generateContent: () => '',
            generateFields: () => '',
            commonContent: () => ''
        };

        const res400 = {
            redirect: (url) => url,
        };

        res400.render = sinon.spy();
        res400.status = sinon.spy();
        res400.statusCode=400;
        res400.body = 'wrong header';

        const runner = new UIStepRunner();
        co(function* () {
            yield runner.handlePost(step, req400, res400);
            expect(res400.statusCode).to.equal(400);
            expect(res400).to.have.property('body');
            expect(res400.body).to.equal('wrong header');
            done();
        });
    });
});
