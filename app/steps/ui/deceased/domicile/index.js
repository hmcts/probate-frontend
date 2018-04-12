const ValidationStep = require('app/core/steps/ValidationStep');

module.exports = class DeceasedDomicile extends ValidationStep {

    static getUrl() {
        return '/deceased-domicile';
    }

};
