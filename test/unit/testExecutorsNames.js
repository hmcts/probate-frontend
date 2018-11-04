'use strict';
const initSteps = require('app/core/initSteps');
const chai = require('chai');
const expect = chai.expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ExecutorsNames = steps.ExecutorsNames;

describe('ExecutorsNames', () => {

    describe('getUrl', () => {
        it('should return the correct url', () => {
            const url = ExecutorsNames.constructor.getUrl();
            expect(url).to.equal('/executors-names');
        });
    });

    describe('getContextData', () => {
        let ctx;
        let req;

        beforeEach(() => {
            req = {
                session: {
                    form: {
                        applicant: {
                            firstName: 'Steve',
                            lastName: 'Madden'
                        }
                    }
                }
            };
        });

        it('returns the lead applicant first name and last name in the context for applicantCurrentName', () => {
            ctx = ExecutorsNames.getContextData(req);
            expect(ctx.applicantCurrentName).to.deep.equal('Steve Madden');
        });

        it('returns the lead applicant alias in the context for applicantCurrentName', () => {
            req.session.form.applicant.alias = 'Bob Alias';
            ctx = ExecutorsNames.getContextData(req);
            expect(ctx.applicantCurrentName).to.deep.equal('Bob Alias');
        });

        it('returns an empty string in the context for applicantCurrentName when no lead applicant name provided', () => {
            delete req.session.form.applicant;
            ctx = ExecutorsNames.getContextData(req);
            expect(ctx.applicantCurrentName).to.deep.equal('');
        });
    });

    describe('handleGet', () => {
        it('returns ctx', () => {
            const ctx = {
                list: [{
                    firstName: 'Bob Richard',
                    lastName: 'Smith',
                    isApplying: true,
                    isApplicant: true
                }, {fullName: 'Michael Jackson'}]
            };
            const [result] = ExecutorsNames.handleGet(ctx);
            expect(result.executorName).to.deep.equal(['Michael Jackson']);
        });
    });

    describe('createExecutorFullNameArray', () => {
        it('creates list executorName', () => {
            const ctx = {};
            ExecutorsNames.createExecutorFullNameArray(ctx);
            expect(ctx.executorName).to.deep.equal([]);
        });

        it('adds executors with fullName to executorName', () => {
            const ctx = {
                list: [{
                    firstName: 'Bob Richard',
                    lastName: 'Smith',
                    isApplying: true,
                    isApplicant: true
                }, {fullName: 'Michael Jackson'}]
            };
            ExecutorsNames.createExecutorFullNameArray(ctx);
            expect(ctx.executorName).to.deep.equal(['Michael Jackson']);
        });
    });

    describe('handlePost', () => {
        it('appends executor to list', () => {
            const ctx = {
                executorsNumber: 2,
                list: [{firstName: 'Bob Richard', lastName: 'Smith'}],
                executorName: ['name1'],
            };
            const [results] = ExecutorsNames.handlePost(ctx);
            expect(results.list).to.deep.equal([{firstName: 'Bob Richard', lastName: 'Smith'}, {fullName: 'name1'}]);
        });

        it('changes list name from executorName list', () => {
            const ctx = {
                executorsNumber: 2,
                list: [{firstName: 'Bob Richard', lastName: 'Smith'}, {fullName: 'name1'}],
                executorName: ['changedName'],
            };
            const [results] = ExecutorsNames.handlePost(ctx);
            expect(results.list).to.deep.equal([{firstName: 'Bob Richard', lastName: 'Smith'}, {fullName: 'changedName'}]);
        });
    });

    describe('action', () => {
        it('deletes applicantCurrentName AND executorName from ctx', () => {
            const ctx = {
                applicantCurrentName: 'Cher',
                executorName: 'Prince'
            };
            const [result] = ExecutorsNames.action(ctx);
            expect(result).to.deep.equal({});
        });
    });

    describe('trimArrayTextFields', () => {
        it('does not amend ctx if executorName does not exist', () => {
            const ctx = {};
            ExecutorsNames.trimArrayTextFields(ctx);
            expect(ctx).to.deep.equal({});
        });

        it('trims whitespace from elements in array', () => {
            const ctx = {executorName: ['name1', 'name2   ', 'name3']};
            ExecutorsNames.trimArrayTextFields(ctx);
            expect(ctx.executorName).to.deep.equal(['name1', 'name2', 'name3']);
        });
    });
});
