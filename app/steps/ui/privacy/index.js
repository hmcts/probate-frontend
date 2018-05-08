const Step = require('app/core/steps/Step');

module.exports = class PrivacyPolicy extends Step {

    static getUrl () {
        return '/privacy-policy';
    }
};
