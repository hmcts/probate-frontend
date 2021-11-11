const ValidationStep = require('app/core/steps/ValidationStep');

class IhtUnusedAllowanceClaimed extends ValidationStep {
    static getUrl() {
        return '/unused-allowance-claimed';
    }
}

module.exports = IhtUnusedAllowanceClaimed;
