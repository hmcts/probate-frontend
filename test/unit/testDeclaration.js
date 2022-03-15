/* eslint-disable max-lines */
'use strict';

const {assert, expect} = require('chai');
const initSteps = require('app/core/initSteps');
const sinon = require('sinon');
const ExecutorsWrapper = require('app/wrappers/Executors');
const content = require('app/resources/en/translation/declaration');
const rewire = require('rewire');
const Declaration = rewire('app/steps/ui/declaration');

describe('Declaration', () => {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]).Declaration;
    const section = 'declaration';
    const templatePath = 'declaration';
    const i18next = {};
    const schema = {
        $schema: 'http://json-schema.org/draft-07/schema',
        properties: {}
    };

    describe('executorsApplying()', () => {
        let hasMultipleApplicants;
        let executorsApplying;
        let hasCodicils;
        let codicilsNumber;
        let deceasedName;
        let mainApplicantName;

        beforeEach(() => {
            hasMultipleApplicants = true;
            executorsApplying = [{
                firstName: 'Applicant',
                lastName: 'Current Name',
                address: 'Applicant address',
                isApplicant: true,
                isApplying: true,
                alias: 'Applicant Will Name',
                aliasReason: 'optionDeedPoll'
            }, {
                fullName: 'Exec 1 Will Name',
                address: 'Exec 1 address',
                isApplying: true,
                currentName: 'Exec 1 Current Name',
                currentNameReason: 'optionMarriage',
                hasOtherName: true
            }, {
                fullName: 'Exec 2 Will Name',
                address: 'Exec 2 address',
                isApplying: true,
                currentName: 'Exec 2 Current Name',
                currentNameReason: 'optionDivorce',
                hasOtherName: true
            }];
            hasCodicils = false;
            deceasedName = 'Mrs Deceased';
            mainApplicantName = 'Applicant Current Name';
        });

        it('should return the correct data when there are no codicils', (done) => {
            const declaration = new Declaration(steps, section, templatePath, i18next, schema);
            const data = declaration.executorsApplying(hasMultipleApplicants, executorsApplying, content, hasCodicils, codicilsNumber, deceasedName, mainApplicantName);

            expect(data).to.deep.equal([{
                name: 'Applicant Current Name, an executor named in the will as Applicant Will Name, is applying for probate. Their name is different because Applicant Current Name changed their name by deed poll.',
                sign: 'Applicant Current Name will send to the probate registry what we have seen and believe to be the true and original last will and testament of Mrs Deceased.'
            }, {
                name: 'Exec 1 Current Name, an executor named in the will as Exec 1 Will Name, is applying for probate. Their name is different because Exec 1 Current Name got married.',
                sign: ''
            }, {
                name: 'Exec 2 Current Name, an executor named in the will as Exec 2 Will Name, is applying for probate. Their name is different because Exec 2 Current Name got divorced.',
                sign: ''
            }]);
            done();
        });

        it('should return the correct data when there is 1 codicils', (done) => {
            hasCodicils = true;
            codicilsNumber = 1;
            const declaration = new Declaration(steps, section, templatePath, i18next, schema);
            const data = declaration.executorsApplying(hasMultipleApplicants, executorsApplying, content, hasCodicils, codicilsNumber, deceasedName, mainApplicantName);

            expect(data).to.deep.equal([{
                name: 'Applicant Current Name, an executor named in the will or codicils as Applicant Will Name, is applying for probate. Their name is different because Applicant Current Name changed their name by deed poll.',
                sign: 'Applicant Current Name will send to the probate registry what we have seen and believe to be the true and original last will and testament, and  codicil of Mrs Deceased.'
            }, {
                name: 'Exec 1 Current Name, an executor named in the will or codicils as Exec 1 Will Name, is applying for probate. Their name is different because Exec 1 Current Name got married.',
                sign: ''
            }, {
                name: 'Exec 2 Current Name, an executor named in the will or codicils as Exec 2 Will Name, is applying for probate. Their name is different because Exec 2 Current Name got divorced.',
                sign: ''
            }]);
            done();
        });

        it('should return the correct data when there is more than 1 codicil', (done) => {
            hasCodicils = true;
            codicilsNumber = 3;
            const declaration = new Declaration(steps, section, templatePath, i18next, schema);
            const data = declaration.executorsApplying(hasMultipleApplicants, executorsApplying, content, hasCodicils, codicilsNumber, deceasedName, mainApplicantName);

            expect(data).to.deep.equal([{
                name: 'Applicant Current Name, an executor named in the will or codicils as Applicant Will Name, is applying for probate. Their name is different because Applicant Current Name changed their name by deed poll.',
                sign: 'Applicant Current Name will send to the probate registry what we have seen and believe to be the true and original last will and testament, and 3 codicils of Mrs Deceased.'
            }, {
                name: 'Exec 1 Current Name, an executor named in the will or codicils as Exec 1 Will Name, is applying for probate. Their name is different because Exec 1 Current Name got married.',
                sign: ''
            }, {
                name: 'Exec 2 Current Name, an executor named in the will or codicils as Exec 2 Will Name, is applying for probate. Their name is different because Exec 2 Current Name got divorced.',
                sign: ''
            }]);
            done();
        });
    });

    describe('executorsApplyingText()', () => {
        let props;

        beforeEach(() => {
            props = {
                hasCodicils: false,
                hasMultipleApplicants: true,
                content: content,
                multipleApplicantSuffix: '-multipleApplicants',
                executor: {
                    fullName: 'Exec 1 Will Name',
                    address: 'Exec 1 address',
                    isApplying: true,
                    currentName: 'Exec 1 Current Name',
                    currentNameReason: 'optionMarriage',
                    hasOtherName: true
                },
                deceasedName: 'Mrs Deceased',
                mainApplicantName: 'Applicant Current Name'
            };
        });

        it('should return the correct content for the applicant', (done) => {
            props.executor.isApplicant = true;
            const declaration = new Declaration(steps, section, templatePath, i18next, schema);
            const content = declaration.executorsApplyingText(props);

            expect(content).to.deep.equal({
                name: 'Exec 1 Current Name, an executor named in the will as Applicant Current Name, is applying for probate. Their name is different because Exec 1 Current Name got married.',
                sign: 'Applicant Current Name will send to the probate registry what we have seen and believe to be the true and original last will and testament of Mrs Deceased.'
            });

            done();
        });

        it('should return the correct content for an other executor', (done) => {
            props.executor.isApplicant = false;
            const declaration = new Declaration(steps, section, templatePath, i18next, schema);
            const content = declaration.executorsApplyingText(props);

            expect(content).to.deep.equal({
                name: 'Exec 1 Current Name, an executor named in the will as Exec 1 Will Name, is applying for probate. Their name is different because Exec 1 Current Name got married.',
                sign: ''
            });

            done();
        });
    });

    describe('resetAgreedFlag()', () => {
        const executorsList = {
            list: [{
                inviteId: '1'
            }, {
                inviteId: '2'
            }, {
                inviteId: '3'
            }]
        };
        const ctx = {
            ccdCase: {
                id: 1234567890123456,
                state: 'Pending'
            },
            executors: executorsList,
            executorsWrapper: new ExecutorsWrapper(executorsList)
        };

        it('Success - there are no Errors in the results', (done) => {
            const revert = Declaration.__set__('InviteData', class {
                resetAgreedFlag() {
                    return Promise.resolve([{agreed: null}]);
                }
            });
            const declaration = new Declaration(steps, section, templatePath, i18next, schema);
            declaration.resetAgreedFlags(ctx)
                .then((results) => {
                    assert.isFalse(results.some(result => result.name === 'Error'));
                    revert();
                    done();
                })
                .catch(err => done(err));
        });

        it('Failure - there is an Error in the results', (done) => {
            const revert = Declaration.__set__('InviteData', class {
                resetAgreedFlag() {
                    return Promise.resolve([new Error('Blimey')]);
                }
            });
            const declaration = new Declaration(steps, section, templatePath, i18next, schema);
            declaration.resetAgreedFlags(ctx)
                .then((results) => {
                    assert.isTrue(results.some(result => result.name === 'Error'));
                    revert();
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('action()', () => {
        let ctx;
        let formdata;

        beforeEach(() => {
            ctx = {
                hasMultipleApplicants: true,
                executorsWrapper: {},
                hasDataChanged: false,
                hasExecutorsToNotify: false,
                executorsEmailChanged: false,
                hasDataChangedAfterEmailSent: true,
                showNetValueAssetsOutside: true,
                ihtNetValueAssetsOutside: 300000,
                bilingual: 'true',
                language: 'cy',
                invitesSent: 'true',
            };
            formdata = {};
        });

        it('test that context variables are removed and empty object returned', (done) => {
            const declaration = new Declaration(steps, section, templatePath, i18next, schema);
            [ctx, formdata] = declaration.action(ctx, formdata);

            expect(ctx).to.deep.equal({});
            done();
        });

        it('test that context variables are removed and object contains just appropriate variables', (done) => {
            ctx.softStop = false;
            const declaration = new Declaration(steps, section, templatePath, i18next, schema);
            [ctx, formdata] = declaration.action(ctx, formdata);

            expect(ctx).to.deep.equal({softStop: false});
            done();
        });

        it('test that context variables are removed and resetAgreedFlags is called', (done) => {
            ctx.hasDataChanged = true;
            ctx.executors = {
                executorsNumber: 3,
                invitesSent: 'true',
                list: [
                    {fullName: 'john', isApplying: true, isApplicant: true},
                    {fullName: 'other applicant', isApplying: true, emailChanged: true},
                    {fullName: 'harvey', isApplying: true, emailChanged: true}
                ]
            };
            ctx.executorsWrapper = new ExecutorsWrapper(ctx);
            const declaration = new Declaration(steps, section, templatePath, i18next, schema);
            declaration.resetAgreedFlags = sinon.spy();

            [ctx, formdata] = declaration.action(ctx, formdata);

            expect(declaration.resetAgreedFlags.calledOnce).to.equal(true);
            expect(declaration.resetAgreedFlags.calledWith(ctx)).to.equal(true);
            expect(ctx).to.deep.equal({
                executors: {
                    executorsNumber: 3,
                    invitesSent: 'true',
                    list: [
                        {fullName: 'john', isApplying: true, isApplicant: true},
                        {fullName: 'other applicant', isApplying: true, emailChanged: true},
                        {fullName: 'harvey', isApplying: true, emailChanged: true}
                    ]
                }
            });
            done();
        });
    });

    describe('isComplete()', () => {
        it('should return the completion status correctly', (done) => {
            const ctx = {};
            const formdata = {
                declaration: {
                    declarationCheckbox: 'false'
                }
            };
            const declaration = new Declaration(steps, section, templatePath, i18next, schema);
            const complete = declaration.isComplete(ctx, formdata);
            expect(complete).to.deep.equal([false, 'inProgress']);
            done();
        });
    });
});
