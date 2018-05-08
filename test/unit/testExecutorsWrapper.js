// eslint-disable-line max-lines

const ExecutorsWrapper = require('app/wrappers/Executors');
const chai = require('chai');
const expect = chai.expect;
let data;

describe('Executors.js', () => {
    beforeEach(() => {
        data = {
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
        beforeEach(() => {
            data = {
                list: [
                    {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true},
                    {fullname: 'ed brown', isApplying: false, notApplyingKey: 'optionPowerReserved'}
                ]
            };
        });

        it('should return a list of applicants not applying when there are not-applying applicants', (done) => {
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsNotApplying()).to.deep.equal([data.list.pop()]);
            done();
        });

        it('should return a empty list when all the executors are applying', (done) => {
            data.list[1].isApplying = true;
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsNotApplying()).to.deep.equal([]);
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
        beforeEach(() => {
            data = {
                list: [
                    {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true},
                    {fullname: 'ed brown', isApplying: false, notApplyingKey: 'optionRenunciated'}
                ]
            };
        });

        it('should return true when there are applicants that have renunciated', (done) => {
            delete data.list[1].isApplicant;
            data.list[1].notApplyingKey = 'optionRenunciated';
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.hasRenunciated()).to.equal(true);
            done();
        });

        it('should return false when no applicants have renunciated', (done) => {
            delete data.list[1].notApplyingKey;
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.hasRenunciated()).to.equal(false);
            done();
        });
    });

    describe('hasRenunciatedOrPowerReserved()', () => {
        beforeEach(() => {
            data = {
                list: [
                    {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true},
                    {fullname: 'ed brown', isApplying: false, notApplyingKey: 'optionPowerReserved'},
                    {fullname: 'jake smith', isApplying: false, notApplyingKey: 'optionRenunciated'}
                ]
            };
        });

        it('should return true when there are applicants that have renunciated and power reserved', (done) => {
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.hasRenunciatedOrPowerReserved()).to.equal(true);
            done();
        });

        it('should return true when there are applicants that have renunciated', (done) => {
            delete data.list[1].notApplyingKey;
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.hasRenunciatedOrPowerReserved()).to.equal(true);
            done();
        });

        it('should return true when there are applicants that have power reserved', (done) => {
            delete data.list[2].notApplyingKey;
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.hasRenunciatedOrPowerReserved()).to.equal(true);
            done();
        });

        it('should return false when no applicants have renunciated or power reserved', (done) => {
            delete data.list[1].notApplyingKey;
            delete data.list[2].notApplyingKey;
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.hasRenunciated()).to.equal(false);
            done();
        });
    });

    describe('aliveExecutors()', () => {
        describe('should return a list of alive executors', () => {
            it('including the applicant when the excludeApplicant flag is not set', (done) => {
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.aliveExecutors()).to.deep.equal(data.list);
                done();
            });

            it('excluding the applicant when the excludeApplicant flag is set', (done) => {
                const executorsWrapper = new ExecutorsWrapper(data);
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

    describe('hasAliveExecutors()', () => {
        it('should return true when there are alive executors', (done) => {
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.hasAliveExecutors()).to.equal(true);
            done();
        });

        it('should return false when there are no alive executors', (done) => {
            data.list[1].isDead = true;
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.hasAliveExecutors()).to.equal(false);
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
        it('returns a list containing executors that have an inviteId', (done) => {
            data.list[1].inviteId = '123456';
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsInvited()).to.deep.equal([data.list.pop()]);
            done();
        });

        it('returns an empty list when no executors have been invited', (done) => {
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsInvited()).to.deep.equal([]);
            done();
        });

        it('should return an empty list when there is no executor data', (done) => {
            const data = {};
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsInvited()).to.deep.equal([]);
            done();
        });
    });

    describe('deadExecutors()', () => {
        beforeEach(() => {
            data = {
                list: [
                    {fullname: 'ed brown', isDead: true}
                ]
            };
        });

        it('should return a list of dead executors', (done) => {
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.deadExecutors()).to.deep.equal(data.list);
            done();
        });

        it('should return an empty list when there is no executor data', (done) => {
            const data = {};
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.deadExecutors()).to.deep.equal([]);
            done();
        });
    });

    describe('hasOtherName()', () => {
        beforeEach(() => {
            data = {
                list: [
                    {fullname: 'James Miller', hasOtherName: true}
                ]
            };
        });

        it('should return true when there are executors with an other name', (done) => {
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.hasOtherName()).to.equal(true);
            done();
        });

        describe('should return false', () => {
            it('when there are no executors with an other name', (done) => {
                delete data.list[0].hasOtherName;
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.hasOtherName()).to.equal(false);
                done();
            });

            it('when there is no executor data', (done) => {
                const data = {};
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.hasOtherName()).to.equal(false);
                done();
            });
        });
    });

    describe('areAllAliveExecutorsApplying()', () => {
        beforeEach(() => {
            data = {
                list: [
                    {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true},
                    {fullname: 'ed brown', isApplying: true},
                    {fullname: 'jake smith', isDead: true}
                ]
            };
        });

        describe('should return true', () => {
            it('when all alive applicants are applying', (done) => {
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.areAllAliveExecutorsApplying()).to.equal(true);
                done();
            });

            it('when there is no executor data', (done) => {
                const data = {};
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.areAllAliveExecutorsApplying()).to.equal(true);
                done();
            });
        });

        it('should return false when not all alive applicants are applying', (done) => {
            data.list[1].isApplying = false;
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.areAllAliveExecutorsApplying()).to.equal(false);
            done();
        });
    });

    describe('executorsWithAnotherName()', () => {
        beforeEach(() => {
            data = {
                list: [
                    {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true},
                    {fullname: 'ed brown', hasOtherName: true},
                    {fullname: 'jake smith', has: true}
                ]
            };
        });

        it('should return a list of executors with another name', (done) => {
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsWithAnotherName()).to.deep.equal([
                {fullname: 'ed brown', hasOtherName: true}
            ]);
            done();
        });

        describe('should return an empty list', () => {
            it('when no executors have another name', (done) => {
                data.list[1].hasOtherName = false;
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.executorsWithAnotherName()).to.deep.equal([]);
                done();
            });

            it('when there is no executor data', (done) => {
                const data = {};
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.executorsWithAnotherName()).to.deep.equal([]);
                done();
            });
        });
    });
});
