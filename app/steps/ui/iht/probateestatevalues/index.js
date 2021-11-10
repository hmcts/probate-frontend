const ValidationStep = require('app/core/steps/ValidationStep');

class ProbateEstateValues extends ValidationStep {
    static getUrl() {
        return '/probate-estate-values';
    }
}

module.exports = ProbateEstateValues;
