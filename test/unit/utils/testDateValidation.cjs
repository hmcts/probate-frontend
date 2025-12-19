const DateValidation = require('app/utils/DateValidation');
const proxyquire = require('proxyquire');
const expect = require('chai').expect;

describe('FormatDate.js', () => {
    beforeEach(() => {
        delete require.cache[require.resolve('config')];
    });

    describe('isInactivePeriod', () => {
        it('should return false if no date is provided', () => {
            expect(DateValidation.isInactivePeriod()).to.equal(false);
        });

        it('should return false if an invalid date is provided', () => {
            expect(DateValidation.isInactivePeriod('invalid-date')).to.equal(false);
        });

        it('should return true for a date older than the inactivity threshold', () => {
            const oldDate = new Date();
            oldDate.setDate(oldDate.getDate() - 91);
            expect(DateValidation.isInactivePeriod(oldDate.toISOString())).to.equal(true);
        });

        it('should return true for a date exactly on the inactivity threshold', () => {
            const thresholdDate = new Date();
            thresholdDate.setDate(thresholdDate.getDate() - 90);
            expect(DateValidation.isInactivePeriod(thresholdDate.toISOString())).to.equal(true);
        });

        it('should return false for a date within the inactivity threshold', () => {
            const recentDate = new Date();
            recentDate.setDate(recentDate.getDate() - 89);
            expect(DateValidation.isInactivePeriod(recentDate.toISOString())).to.equal(false);
        });
    });

    describe('daysToDelete', () => {
        it('should return 0 if no date is provided', () => {
            expect(DateValidation.daysToDelete()).to.equal(0);
        });

        it('should return 0 for an invalid date format', () => {
            expect(DateValidation.daysToDelete('invalid-date')).to.equal(0);
        });

        it('should return 0 if the deletion date is in the past', () => {
            const mockConfig = {
                disposal: {
                    switchDate: '2024-01-01',
                    inactivityDaysThreshold: 90,
                    deletionDaysThreshold: 90,
                },
            };

            const DateValidation = proxyquire('app/utils/DateValidation', {
                'config': mockConfig,
            });

            const pastDate = '2023-01-01';
            expect(DateValidation.daysToDelete(pastDate)).to.equal(0);
        });

        it('should return correct days when last modified date is exactly 90 days before switchDate', () => {
            const mockConfig = {
                disposal: {
                    switchDate: '2024-01-01',
                    inactivityDaysThreshold: 90,
                    deletionDaysThreshold: 90,
                },
            };

            const DateValidation = proxyquire('app/utils/DateValidation', {
                'config': mockConfig,
            });
            const inputDate = '2023-10-02';
            const expectedDeletionDate = new Date('2024-04-01');
            const today = new Date();
            const expectedDaysLeft = Math.max(0, Math.ceil((expectedDeletionDate - today) / (1000 * 60 * 60 * 24)));
            expect(DateValidation.daysToDelete(inputDate)).to.equal(expectedDaysLeft);
            delete process.env.SWITCH_DATE;
        });

        it('should return correct days when last modified date is after the 90-day threshold', () => {
            const mockConfig = {
                disposal: {
                    switchDate: '2024-01-01',
                    inactivityDaysThreshold: 90,
                    deletionDaysThreshold: 90,
                },
            };

            const DateValidation = proxyquire('app/utils/DateValidation', {
                'config': mockConfig,
            });
            const inputDate = '2023-12-15';
            const expectedDeletionDate = new Date('2024-04-01');
            const today = new Date();
            const expectedDaysLeft = Math.max(0, Math.ceil((expectedDeletionDate - today) / (1000 * 60 * 60 * 24)));

            expect(DateValidation.daysToDelete(inputDate)).to.equal(expectedDaysLeft);
            delete process.env.SWITCH_DATE;
        });

        it('should return correct days when last modified date is recent', () => {
            const mockConfig = {
                disposal: {
                    switchDate: '2024-01-01',
                    inactivityDaysThreshold: 90,
                    deletionDaysThreshold: 90,
                },
            };

            const DateValidation = proxyquire('app/utils/DateValidation', {
                'config': mockConfig,
            });
            const inputDate = '2024-01-10'; // Recent modification date
            const expectedDeletionDate = new Date('2024-07-08'); // 180 days after inputDate
            const today = new Date();
            const expectedDaysLeft = Math.max(0, Math.ceil((expectedDeletionDate - today) / (1000 * 60 * 60 * 24)));

            expect(DateValidation.daysToDelete(inputDate)).to.equal(expectedDaysLeft);
        });

        it('should return correct days for an old case far before switchDate', () => {
            const mockConfig = {
                disposal: {
                    switchDate: '2024-01-01',
                    inactivityDaysThreshold: 90,
                    deletionDaysThreshold: 90,
                },
            };

            const DateValidation = proxyquire('app/utils/DateValidation', {
                'config': mockConfig,
            });
            const inputDate = '2023-06-01'; // Old case
            const expectedDeletionDate = new Date('2024-05-01'); // 90 days after switchDate
            const today = new Date();
            const expectedDaysLeft = Math.max(0, Math.ceil((expectedDeletionDate - today) / (1000 * 60 * 60 * 24)));

            expect(DateValidation.daysToDelete(inputDate)).to.equal(expectedDaysLeft);
        });
    });
});
