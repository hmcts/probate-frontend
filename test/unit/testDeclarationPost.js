'use strict';

const expect = require('chai').expect;
const initSteps = require('app/core/initSteps');
const sinon = require('sinon');
const rewire = require('rewire');
const Declaration = rewire('app/steps/ui/declaration');
const co = require('co');
const UploadLegalDeclaration = require('app/services/UploadLegalDeclaration');

describe('Declaration', () => {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]).Declaration;
    const section = 'declaration';
    const templatePath = 'declaration';
    const i18next = {};
    const schema = {
        $schema: 'http://json-schema.org/draft-07/schema',
        properties: {}
    };

    describe('post()', () => {
        let ctx;
        let formdata;
        let errors;
        let session;

        beforeEach(() => {
            ctx = {};
            formdata = {
                applicantEmail: 'test@test.com',
                ccdCase: {
                    id: '1234'
                }
            };
            session = {
                form: {},
                req: {
                    userId: '1234',
                    session: {
                        serviceAuthorization: 'serviceToken1234'
                    },
                    authToken: 'authToken123456'
                }
            };
            errors = [];
        });
        it('should call UploadLegalDeclaration on post', (done) => {
            const revert = Declaration.__set__('ServiceMapper', class {
                static map() {
                    return class {
                        static put() {
                            return Promise.resolve({});
                        }
                    };
                }
            });

            const statementOfTruthDocument = {
                filename: 'filename.pdf',
                url: 'http://localhost:8383/documents/60e34ae2-8816-48a6-8b74-a1a3639cd505'
            };

            co(function* () {
                const stub = sinon.stub(UploadLegalDeclaration.prototype, 'generateAndUpload')
                    .returns(statementOfTruthDocument);

                const declaration = new Declaration(steps, section, templatePath, i18next, schema);

                [ctx, errors] = yield declaration.handlePost(ctx, errors, formdata, session);

                expect(formdata.statementOfTruthDocument).to.deep.equal(statementOfTruthDocument);
                stub.restore();
                revert();
                done();
            }).catch(err => {
                done(err);
            });
        });
    }
    );
});
