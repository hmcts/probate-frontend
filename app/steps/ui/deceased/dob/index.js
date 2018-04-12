const DateStep = require('app/core/steps/DateStep');

module.exports = class DeceasedDob extends DateStep {

    static getUrl() {
        return '/deceased-dob';
    }

    dateName() {
        return 'dob';
    }
};
