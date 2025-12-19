'use strict';

const expect = require('chai').expect;
const initSteps = require('app/core/initSteps');
const sinon = require('sinon');
const rewire = require('rewire');
const Declaration = rewire('app/steps/ui/declaration');
const co = require('co');
const UploadLegalDeclaration = require('app/services/UploadLegalDeclaration');
const caseTypes = require('app/utils/CaseTypes');
const {assert} = require('chai');

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
        let stub;

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

        afterEach(() => {
            stub.restore();
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

            formdata = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried',
                },
                applicant: {
                    relationshipToDeceased: 'optionChild'
                }
            };

            co(function* () {
                stub = sinon.stub(UploadLegalDeclaration.prototype, 'generateAndUpload')
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
        it('should call handle post and set Interim Certificate docs required field if conditions met', (done) => {
            const revert = Declaration.__set__('ServiceMapper', class {
                static map() {
                    return class {
                        static put() {
                            return Promise.resolve({});
                        }
                    };
                }
            });

            formdata = {
                applicantEmail: 'test@test.com',
                ccdCase: {
                    id: '1234'
                },
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried',
                    deathCertificate: 'optionInterimCertificate'
                },
                applicant: {
                    relationshipToDeceased: 'optionSpousePartner'
                },
                iht: {
                    estateValueCompleted: 'optionNo'
                }
            };

            const statementOfTruthDocument = {
                filename: 'filename.pdf',
                url: 'http://localhost:8383/documents/60e34ae2-8816-48a6-8b74-a1a3639cd505'
            };

            co(function* () {
                stub = sinon.stub(UploadLegalDeclaration.prototype, 'generateAndUpload')
                    .returns(statementOfTruthDocument);

                const declaration = new Declaration(steps, section, templatePath, i18next, schema);

                [ctx, errors] = yield declaration.handlePost(ctx, errors, formdata, session);

                expect(errors).to.deep.equal([]);
                assert.isUndefined(formdata.applicant.notRequiredToSendDocuments);
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
