'use strict';

const ValidationStep = require('app/core/steps/ValidationStep.cjs');

class ReportEstateValues extends ValidationStep {

    static getUrl() {
        return '/report-estate-values';
    }

}

module.exports = ReportEstateValues;
