const ExecutorsWrapper = require('app/wrappers/Executors');
const chai = require('chai');
const expect = chai.expect;
let data;
let dataWithDeadExecutor;

describe('Executors.js', () => {
    beforeEach(() => {
        data =  {
            list: [
                {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true},
                {fullname: 'ed brown', isApplying: true}
            ]
        };
    });

    describe('executors()', () => {
        describe('should return a list of executors', () => {
            it('including the applicant when the excludeApplicant flag is not set', (done) => {
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.executors()).to.deep.equal(data.list);
                done();
            });

            it('excluding the applicant when the excludeApplicant flag is set', (done) => {
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.executors(true)).to.deep.equal([data.list.pop()]);
                done();
            });
        });

        it('should return an empty list when there is no executor data', (done) => {
            const data = {};
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executors()).to.deep.equal([]);
            done();
        });
    });

    describe('executorsApplying()', () => {
        describe('should return a list of applying executors', () => {
            it('including the applicant when the excludeApplicant flag is not set', (done) => {
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.executorsApplying()).to.deep.equal(data.list);
                done();
            });

            it('excluding the applicant when the excludeApplicant flag is set', (done) => {
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.executorsApplying(true)).to.deep.equal([data.list.pop()]);
                done();
            });
        });

        it('should return an empty list when there is no executor data', (done) => {
            const data = {};
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsApplying()).to.deep.equal([]);
            done();
        });
    });

    describe('executorsNotApplying()', () => {
        it('should return a list of applicants not applying when there are not-applying applicants', (done) => {
            delete data.list[1].isApplying;
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsNotApplying()).to.deep.equal([data.list[1]]);
            done();
        });

        it('should return a empty list when all the executors are applying', (done) => {
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsNotApplying('joe smith')).to.deep.equal([]);
            done();
        });

        it('should return an empty list when there is no executor data', (done) => {
            const data = {};
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsNotApplying()).to.deep.equal([]);
            done();
        });
    });

    describe('hasMultipleApplicants()', () => {
        it('should return true when there are multiple applicants', (done) => {
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.hasMultipleApplicants()).to.equal(true);
            done();
        });

        it('should return false when there is a single applicant', (done) => {
            data.list = [data.list.shift()];
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.hasMultipleApplicants()).to.equal(false);
            done();
        });
    });

    describe('hasRenunciated()', () => {
        it('should return true when there are applicants that have renunciated', (done) => {
            delete data.list[1].isApplicant;
            data.list[1].notApplyingKey = 'optionRenunciated';
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.hasRenunciated()).to.equal(true);
            done();
        });

        it('should return false when no applicants have renunciated', (done) => {
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.hasRenunciated()).to.equal(false);
            done();
        });
    });

    describe('aliveExecutors()', () => {
        beforeEach(() => {
            dataWithDeadExecutor = {
                list: [
                    {fullname: 'jake smith', isDead: true},
                    ...data.list
                ]
            };
        });

        describe('should return a list of alive executors', () => {
            it('including the applicant when the excludeApplicant flag is not set', (done) => {
                const executorsWrapper = new ExecutorsWrapper(dataWithDeadExecutor);
                expect(executorsWrapper.aliveExecutors()).to.deep.equal(data.list);
                done();
            });

            it('excluding the applicant when the excludeApplicant flag is set', (done) => {
                const executorsWrapper = new ExecutorsWrapper(dataWithDeadExecutor);
                expect(executorsWrapper.aliveExecutors(true)).to.deep.equal([data.list.pop()]);
                done();
            });
        });

        it('should return an empty list when there is no executor data', (done) => {
            const data = {};
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.aliveExecutors()).to.deep.equal([]);
            done();
        });
    });

    describe('excludeApplicant()', () => {
        describe('should return a list of executors', () => {
            it('including the applicant when the excludeApplicant flag is not set', (done) => {
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.excludeApplicant(data.list)).to.deep.equal(data.list);
                done();
            });

            it('excluding the applicant when the excludeApplicant flag is set', (done) => {
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.excludeApplicant(data.list, true)).to.deep.equal([data.list.pop()]);
                done();
            });
        });
    });

    describe('invitedExecutors()', () => {
        describe('should return a list of invited executors', () => {
            it('returns a list containing executors that have an inviteId', (done) => {
                data.list[1].inviteId = '123456';
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.executorsInvited()).to.deep.equal([data.list.pop()]);
                done();
            });

            it('returns and empty list when none have been invited', (done) => {
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.executorsInvited()).to.deep.equal([]);
                done();
            });
        });

        it('should return an empty list when there is no executor data', (done) => {
            const data = {};
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsInvited()).to.deep.equal([]);
            done();
        });
    });
});
