'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');
const UploadLegalDeclaration = rewire('app/services/UploadLegalDeclaration');
const co = require('co');

describe('UploadLegalDeclaration', () => {
    describe('generateAndUpload()', () => {
        it('should generate and upload LegalStatement correctly', (done) => {
            const docUrl = 'http://localhost:8080/documents/60e34ae2-8816-48a6-8b74-a1a3639cd505';
            const revertUpload = UploadLegalDeclaration.__set__('ServiceMapper', class {
                static map() {
                    return class {
                        static post() {
                            return Promise.resolve({});
                        }
                    };
                }
            });

            const req = {
                session: {
                    serviceAuthorization: 'serviceToken1234'
                },
                authToken: 'authToken123456'
            };

            const revert = UploadLegalDeclaration.__set__('Document', class {
                post() {
                    return Promise.resolve({
                        body: [docUrl]
                    });
                }
            });

            co(function* () {
                const uploadLegalDeclaration = new UploadLegalDeclaration();
                const sotDocument = yield uploadLegalDeclaration.generateAndUpload('sid', 'uid', req);

                expect(sotDocument).to.deep.equal({url: docUrl, filename: 'LegalStatement.pdf'});
                revertUpload();
                revert();
                done();
            }).catch(err => {
                done(err);
            });
        });
    });
});
