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
                {fullName: 'ed brown', isApplying: true}
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
                    {fullName: 'ed brown', isApplying: false, notApplyingKey: 'optionPowerReserved'}
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
                    {fullName: 'ed brown', isApplying: false, notApplyingKey: 'optionRenunciated'}
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
                    {fullName: 'ed brown', isApplying: false, notApplyingKey: 'optionPowerReserved'},
                    {fullName: 'jake smith', isApplying: false, notApplyingKey: 'optionRenunciated'}
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
                    {fullName: 'ed brown', isDead: true}
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
                    {fullName: 'James Miller', hasOtherName: true}
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
                    {fullName: 'ed brown', isApplying: true},
                    {fullName: 'jake smith', isDead: true}
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
                    {fullName: 'ed brown', hasOtherName: true},
                    {fullName: 'jake smith', has: true}
                ]
            };
        });

        it('should return a list of executors with another name', (done) => {
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsWithAnotherName()).to.deep.equal([
                {fullName: 'ed brown', hasOtherName: true}
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

    describe('mainApplicant()', () => {
        beforeEach(() => {
            data = {
                list: [
                    {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true},
                    {fullName: 'ed brown', isApplying: true}
                ]
            };
        });
        it('should return the main applicant', (done) => {
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.mainApplicant()).to.deep.equal([
                {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true}
            ]);
            done();
        });

        describe('should return an empty list', () => {
            it('when none of the executors is the main applicant', (done) => {
                data.list[0].isApplicant = false;
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.mainApplicant()).to.deep.equal([]);
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

    describe('executorsToRemove()', () => {
        beforeEach(() => {
            data = {
                list: [
                    {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true},
                    {fullName: 'ed brown', isApplying: true, inviteId: 'invite_123'},
                    {fullName: 'bob brown', isApplying: true, inviteId: 'invite_456'},
                    {fullName: 'steve brown', isApplying: true, inviteId: 'invite_789'}
                ]
            };
        });
        it('should return those not applying who have received an invite email', (done) => {
            data.list[3].isApplying = false;
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsToRemove()).to.deep.equal([
                {fullName: 'steve brown', isApplying: false, inviteId: 'invite_789'}
            ]);
            done();
        });

        describe('should return an empty list', () => {
            it('when none of the executors has an inviteId', (done) => {
                delete data.list[1].inviteId;
                delete data.list[2].inviteId;
                delete data.list[3].inviteId;
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.executorsToRemove()).to.deep.equal([]);
                done();
            });

            it('when all executors are applying', (done) => {
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.executorsToRemove()).to.deep.equal([]);
                done();
            });
        });
    });

    describe('removeExecutorsInviteData()', () => {
        it('should remove the inviteId of Executors who are not applying', (done) => {
            const data = {
                list: [
                    {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true},
                    {fullName: 'ed brown', isApplying: true, inviteId: 'invite_123', emailSent: true},
                    {fullName: 'bob brown', isApplying: false, inviteId: 'invite_456', emailSent: true},
                    {fullName: 'steve brown', isApplying: false, inviteId: 'invite_789', emailSent: true}
                ]
            };
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.removeExecutorsInviteData()).to.deep.equal([
                {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true},
                {fullName: 'ed brown', isApplying: true, inviteId: 'invite_123', emailSent: true},
                {fullName: 'bob brown', isApplying: false},
                {fullName: 'steve brown', isApplying: false}
            ]);
            done();
        });
    });

    describe('executorsRemoved()', () => {
        it('should return a list of executors to be removed', (done) => {
            const data = {
                executorsRemoved: [
                    {fullName: 'ed brown', isApplying: true, inviteId: 'invite_123'},
                    {fullName: 'bob brown', isApplying: true, inviteId: 'invite_456'}
                ]
            };
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsRemoved()).to.deep.equal(data.executorsRemoved);
            done();
        });

        it('should return an empty list when there are no executors to be removed', (done) => {
            const data = {};
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsRemoved()).to.deep.equal([]);
            done();
        });
    });

    describe('executorsNameChangedByDeedPoll()', () => {
        it('should return only the lead applicant', (done) => {
            const data = {
                list: [
                    {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true, alias: 'jimbo fisher', aliasReason: 'Change by deed poll'},
                    {fullName: 'ed brown', isApplying: true, currentName: 'eddie jones', currentNameReason: 'Marriage'},
                    {fullName: 'bob brown', isApplying: true, currentName: 'bobbie houston', currentNameReason: 'Divorce'}
                ]
            };
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsNameChangedByDeedPoll()).to.deep.equal(['jimbo fisher']);
            done();
        });

        it('should return only one other executor who has name changed by deed poll', (done) => {
            const data = {
                list: [
                    {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true, alias: 'jimbo fisher', aliasReason: 'Divorce'},
                    {fullName: 'ed brown', isApplying: true, currentName: 'eddie jones', currentNameReason: 'Change by deed poll'},
                    {fullName: 'bob brown', isApplying: true, currentName: 'bobbie houston', currentNameReason: 'Marriage'}
                ]
            };
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsNameChangedByDeedPoll()).to.deep.equal(['eddie jones']);
            done();
        });

        it('should return a list of multiple executor aliases for those who gave reason for name change as deed poll', (done) => {
            const data = {
                list: [
                    {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true, alias: 'jimbo fisher', aliasReason: 'Divorce'},
                    {fullName: 'ed brown', isApplying: true, currentName: 'eddie jones', currentNameReason: 'Change by deed poll'},
                    {fullName: 'bob brown', isApplying: true, currentName: 'bobbie houston', currentNameReason: 'Change by deed poll'}
                ]
            };
            const executorsWrapper = new ExecutorsWrapper(data);
            expect(executorsWrapper.executorsNameChangedByDeedPoll()).to.deep.equal([
                'eddie jones',
                'bobbie houston'
            ]);
            done();
        });

        describe('should return an empty list', () => {
            it('when no executors have given deed poll as their reason for name change', (done) => {
                const data = {
                    list: [
                        {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true, alias: 'jimbo fisher', aliasReason: 'Divorce'},
                        {fullName: 'ed brown', isApplying: true, currentName: 'eddie jones', currentNameReason: 'Marriage'},
                        {fullName: 'bob brown', isApplying: true, currentName: 'bobbie houston', currentNameReason: 'other', otherReason: 'Did not like my name'}
                    ]
                };
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.executorsNameChangedByDeedPoll()).to.deep.equal([]);
                done();
            });

            it('when the executors list is empty', (done) => {
                const data = {
                    list: []
                };
                const executorsWrapper = new ExecutorsWrapper(data);
                expect(executorsWrapper.executorsNameChangedByDeedPoll()).to.deep.equal([]);
                done();
            });
        });
    });
});
