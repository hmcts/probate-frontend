'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const co = require('co');
const rewire = require('rewire');
const Summary = rewire('app/steps/ui/summary/index');
const probateJourney = require('app/journeys/probate');

describe('Summary', () => {
    const steps = initSteps([__dirname + '/../../app/steps/action/', __dirname + '/../../app/steps/ui']);
    let section;
    let templatePath;
    let i18next;
    let schema;

    beforeEach(() => {
        section = 'summary';
        templatePath = 'summary';
        i18next = {};
        schema = {
            $schema: 'http://json-schema.org/draft-04/schema#',
            properties: {}
        };
    });

    describe('handleGet()', () => {
        it('ctx.executorsWithOtherNames returns array of execs with other names', (done) => {
            const expectedResponse = ['Prince', 'Cher'];
            const revert = Summary.__set__('ValidateData', class {
                post() {
                    return Promise.resolve(expectedResponse);
                }
            });
            let ctx = {
                session: {
                    form: {},
                    journey: probateJourney
                }
            };
            const formdata = {executors: {list: [{fullName: 'Prince', hasOtherName: true}, {fullName: 'Cher', hasOtherName: true}]}};
            const summary = new Summary(steps, section, templatePath, i18next, schema);

            co(function* () {
                [ctx] = yield summary.handleGet(ctx, formdata);
                assert.deepEqual(ctx.executorsWithOtherNames, expectedResponse);
                revert();
                done();
            });
        });

        it('executorsWithOtherNames returns empty when hasOtherName is false', (done) => {
            const expectedResponse = [];
            const revert = Summary.__set__('ValidateData', class {
                post() {
                    return Promise.resolve(expectedResponse);
                }
            });
            let ctx = {
                session: {
                    form: {},
                    journey: probateJourney
                }
            };
            const formdata = {executors: {list: [{fullName: 'Prince', hasOtherName: false}, {fullName: 'Cher', hasOtherName: false}]}};
            const summary = new Summary(steps, section, templatePath, i18next, schema);

            co(function* () {
                [ctx] = yield summary.handleGet(ctx, formdata);
                assert.deepEqual(ctx.executorsWithOtherNames, expectedResponse);
                revert();
                done();
            });
        });

        it('executorsWithOtherNames returns empty when list is empty', (done) => {
            const expectedResponse = [];
            const revert = Summary.__set__('ValidateData', class {
                post() {
                    return Promise.resolve(expectedResponse);
                }
            });
            let ctx = {
                session: {
                    form: {},
                    journey: probateJourney
                }
            };
            const formdata = {executors: {list: []}};
            const summary = new Summary(steps, section, templatePath, i18next, schema);

            co(function* () {
                [ctx] = yield summary.handleGet(ctx, formdata);
                assert.deepEqual(ctx.executorsWithOtherNames, expectedResponse);
                revert();
                done();
            });
        });

        it('check feature toggles are set correctly to true', (done) => {
            const expectedResponse = true;
            const revert = Summary.__set__('ValidateData', class {
                post() {
                    return Promise.resolve(expectedResponse);
                }
            });
            let ctx = {
                session: {
                    form: {},
                    journey: probateJourney
                }
            };
            const formdata = {executors: {list: []}};
            const featureToggles = {
                document_upload: true
            };
            const summary = new Summary(steps, section, templatePath, i18next, schema);

            co(function* () {
                [ctx] = yield summary.handleGet(ctx, formdata, featureToggles);
                assert.equal(ctx.isDocumentUploadToggleEnabled, expectedResponse);
                revert();
                done();
            });
        });

        it('check feature toggles are set correctly to false', (done) => {
            const expectedResponse = false;
            const revert = Summary.__set__('ValidateData', class {
                post() {
                    return Promise.resolve(expectedResponse);
                }
            });
            let ctx = {
                session: {
                    form: {},
                    journey: probateJourney
                }
            };
            const formdata = {executors: {list: []}};
            const featureToggles = {
                document_upload: false
            };
            const summary = new Summary(steps, section, templatePath, i18next, schema);

            co(function* () {
                [ctx] = yield summary.handleGet(ctx, formdata, featureToggles);
                assert.equal(ctx.isDocumentUploadToggleEnabled, expectedResponse);
                revert();
                done();
            });
        });
    });

    describe('getContextData()', () => {
        it('ctx.uploadedDocuments returns an array of uploaded documents when there uploaded documents', (done) => {
            const req = {
                session: {
                    form: {
                        documents: {
                            uploads: [{filename: 'screenshot1.png'}, {filename: 'screenshot2.png'}]
                        }
                    }
                },
            };
            const Summary = steps.Summary;
            const ctx = Summary.getContextData(req);
            expect(ctx.uploadedDocuments).to.deep.equal(['screenshot1.png', 'screenshot2.png']);
            done();
        });

        it('ctx.uploadedDocuments returns an empty array of uploaded documents when there no uploaded documents', (done) => {
            const req = {
                session: {
                    form: {
                        documents: {
                            uploads: []
                        }
                    }
                },
            };
            const Summary = steps.Summary;
            const ctx = Summary.getContextData(req);
            expect(ctx.uploadedDocuments).to.deep.equal([]);
            done();
        });
    });
});
