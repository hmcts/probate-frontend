'use strict';

const {assert, expect} = require('chai');
const initSteps = require('app/core/initSteps');
const services = require('app/components/services');
const sinon = require('sinon');
const ExecutorsWrapper = require('app/wrappers/Executors');
const content = require('app/resources/en/translation/declaration');

describe('Declaration tests', () => {
    const Declaration = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]).Declaration;

    describe('prepareDataForTemplate()', () => {
        let ctx;
        let formdata;

        beforeEach(() => {
            formdata = {
                applicant: {
                    address: 'Applicant address',
                    isApplicant: true,
                    firstName: 'Applicant',
                    lastName: 'Current Name'
                },
                executors: {
                    list: [{
                        firstName: 'Applicant',
                        lastName: 'Current Name',
                        address: 'Applicant address',
                        isApplicant: true,
                        isApplying: true,
                        alias: 'Applicant Will Name',
                        aliasReason: 'Change by deed poll'
                    }, {
                        fullName: 'Exec 1 Will Name',
                        address: 'Exec 1 address',
                        isApplying: true,
                        currentName: 'Exec 1 Current Name',
                        currentNameReason: 'Marriage',
                        hasOtherName: true
                    }, {
                        fullName: 'Exec 2 Will Name',
                        address: 'Exec 2 address',
                        isApplying: true,
                        currentName: 'Exec 2 Current Name',
                        currentNameReason: 'Divorce',
                        hasOtherName: true
                    }]
                },
                deceased: {
                    firstName: 'Mrs',
                    lastName: 'Deceased'
                }
            };
            ctx = {
                executorsWrapper: new ExecutorsWrapper(formdata.executors)
            };
        });

        it('should return the correct data', (done) => {
            const data = Declaration.prepareDataForTemplate(ctx, content, formdata);

            expect(data.legalStatement.applicant).to.equal('We, Applicant Current Name of Applicant address, Exec 1 Current Name of Exec 1 address and Exec 2 Current Name of Exec 2 address, make the following statement:');

            expect(data.legalStatement.executorsApplying).to.deep.equal([{
                name: 'Applicant Current Name, an executor named in the will as Applicant Will Name, is applying for probate. Their name is different because Applicant Current Name changed their name by deed poll.',
                sign: 'Applicant Current Name will send to the probate registry what they believe to be the true and original last will and testament of Mrs Deceased.'
            }, {
                name: 'Exec 1 Current Name, an executor named in the will as Exec 1 Will Name, is applying for probate. Their name is different because Exec 1 Current Name got married.',
                sign: ''
            }, {
                name: 'Exec 2 Current Name, an executor named in the will as Exec 2 Will Name, is applying for probate. Their name is different because Exec 2 Current Name got divorced.',
                sign: ''
            }]);

            done();
        });
    });

    describe('executorsApplying()', () => {
        let hasMultipleApplicants;
        let executorsApplying;
        let hasCodicils;
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
                aliasReason: 'Change by deed poll'
            }, {
                fullName: 'Exec 1 Will Name',
                address: 'Exec 1 address',
                isApplying: true,
                currentName: 'Exec 1 Current Name',
                currentNameReason: 'Marriage',
                hasOtherName: true
            }, {
                fullName: 'Exec 2 Will Name',
                address: 'Exec 2 address',
                isApplying: true,
                currentName: 'Exec 2 Current Name',
                currentNameReason: 'Divorce',
                hasOtherName: true
            }];
            hasCodicils = false;
            deceasedName = 'Mrs Deceased';
            mainApplicantName = 'Applicant Current Name';
        });

        it('should return the correct data', (done) => {
            const data = Declaration.executorsApplying(hasMultipleApplicants, executorsApplying, content, hasCodicils, deceasedName, mainApplicantName);

            expect(data).to.deep.equal([{
                name: 'Applicant Current Name, an executor named in the will as Applicant Will Name, is applying for probate. Their name is different because Applicant Current Name changed their name by deed poll.',
                sign: 'Applicant Current Name will send to the probate registry what they believe to be the true and original last will and testament of Mrs Deceased.'
            }, {
                name: 'Exec 1 Current Name, an executor named in the will as Exec 1 Will Name, is applying for probate. Their name is different because Exec 1 Current Name got married.',
                sign: ''
            }, {
                name: 'Exec 2 Current Name, an executor named in the will as Exec 2 Will Name, is applying for probate. Their name is different because Exec 2 Current Name got divorced.',
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
                    currentNameReason: 'Marriage',
                    hasOtherName: true
                },
                deceasedName: 'Mrs Deceased',
                mainApplicantName: 'Applicant Current Name'
            };
        });

        it('should return the correct content for the applicant', (done) => {
            props.executor.isApplicant = true;
            const content = Declaration.executorsApplyingText(props);

            expect(content).to.deep.equal({
                name: 'Exec 1 Current Name, an executor named in the will as Applicant Current Name, is applying for probate. Their name is different because Exec 1 Current Name got married.',
                sign: 'Applicant Current Name will send to the probate registry what they believe to be the true and original last will and testament of Mrs Deceased.'
            });

            done();
        });

        it('should return the correct content for an other executor', (done) => {
            props.executor.isApplicant = false;
            const content = Declaration.executorsApplyingText(props);

            expect(content).to.deep.equal({
                name: 'Exec 1 Current Name, an executor named in the will as Exec 1 Will Name, is applying for probate. Their name is different because Exec 1 Current Name got married.',
                sign: ''
            });

            done();
        });
    });

    describe('resetAgreedFlags()', () => {
        let updateInviteDataStub;
        const executorsInvited = [
            {inviteId: '1'},
            {inviteId: '2'},
            {inviteId: '3'}
        ];

        beforeEach(() => {
            updateInviteDataStub = sinon.stub(services, 'updateInviteData');
        });

        afterEach(() => {
            updateInviteDataStub.restore();
        });

        it('Success - there are no Errors in the results', (done) => {
            updateInviteDataStub.returns(Promise.resolve({agreed: null}));
            Declaration.resetAgreedFlags(executorsInvited)
                .then((results) => {
                    assert.isFalse(results.some(result => result.name === 'Error'));
                    done();
                })
                .catch(err => done(err));
        });

        it('Failure - there is an Error in the results', (done) => {
            updateInviteDataStub.returns(Promise.resolve(new Error('Blimey')));
            Declaration.resetAgreedFlags(executorsInvited)
                .then((results) => {
                    assert.isTrue(results.some(result => result.name === 'Error'));
                    done();
                })
                .catch(err => done(err));
        });
    });

    describe('action()', () => {
        let ctx;
        let formdata;
        let updateInviteDataStub;

        beforeEach(() => {
            updateInviteDataStub = sinon.stub(services, 'updateInviteData');
            ctx = {
                hasMultipleApplicants: true,
                hasDataChanged: false,
                executorsEmailChanged: false,
                hasDataChangedAfterEmailSent: true,
                invitesSent: 'true',
            };
            formdata = {};
        });

        afterEach(() => {
            updateInviteDataStub.restore();
        });

        it('test that context variables are removed and empty object returned', (done) => {
            [ctx, formdata] = Declaration.action(ctx, formdata);

            expect(ctx).to.deep.equal({});

            done();
        });

        it('test that context variables are removed and object contains just appropriate variables', (done) => {
            ctx.softStop = false;
            [ctx, formdata] = Declaration.action(ctx, formdata);

            expect(ctx).to.deep.equal({softStop: false});

            done();
        });

        it('test that context variables are removed and resetAgreedFlags is called', (done) => {
            updateInviteDataStub.returns(Promise.resolve({agreed: null}));
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
            ctx.executorsWrapper = new ExecutorsWrapper(ctx.executors);
            [ctx, formdata] = Declaration.action(ctx, formdata);

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
});
