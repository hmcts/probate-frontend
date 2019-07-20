'use strict';

const Step = require('app/core/steps/Step');
const featureToggle = require('app/utils/FeatureToggle');

class CopiesStart extends Step {

    static getUrl() {
        return '/copies-start';
    }

    handleGet(ctx, formdata, featureToggles) {
        ctx.isCopiesFeesToggleEnabled = featureToggle.isEnabled(featureToggles, 'copies_fees');

        return [ctx];
    }
}

module.exports = CopiesStart;
