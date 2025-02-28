'use strict';

const config = require('config');

class DateValidation {
    static isPositive(dateArray) {
        if (!dateArray) {
            throw new TypeError(`no dateArray found: ${dateArray}`);
        }
        for (let i = 0; i < dateArray.length; i++) {
            if (parseInt(dateArray[i]) < 1) {
                return false;
            }
        }
        return true;
    }

    static isInactivePeriod(date) {
        if (!date) {
            return false;
        }
        const inactivityDaysThreshold = config.disposal.inactivityDaysThreshold;
        const lastModifiedDate = new Date(date);
        if (isNaN(lastModifiedDate)) {
            return false;
        }
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - inactivityDaysThreshold);
        return lastModifiedDate <= cutoffDate;
    }

    static daysToDelete(date) {
        if (!date) {
            return 0;
        }
        const switchDate = new Date(config.disposal.switchDate);
        const inactivityDaysThreshold = config.disposal.inactivityDaysThreshold;
        const deletionDaysThreshold = config.disposal.deletionDaysThreshold;
        const lastModifiedDate = new Date(date);
        if (isNaN(lastModifiedDate)) {
            return 0;
        }

        const inactiveBeforeSwitchDate = new Date(switchDate);
        inactiveBeforeSwitchDate.setDate(inactiveBeforeSwitchDate.getDate() - inactivityDaysThreshold);

        let deletionDate;
        if (lastModifiedDate <= inactiveBeforeSwitchDate) {
            deletionDate = new Date(switchDate);
            deletionDate.setDate(deletionDate.getDate() + deletionDaysThreshold);
        } else {
            deletionDate = new Date(lastModifiedDate);
            deletionDate.setDate(deletionDate.getDate() + inactivityDaysThreshold + deletionDaysThreshold);
        }
        return Math.max(0, Math.ceil((deletionDate - new Date()) / (1000 * 60 * 60 * 24)));
    }
}

module.exports = DateValidation;
