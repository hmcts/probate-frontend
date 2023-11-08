'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class ReportEstateValues extends ValidationStep {

    static getUrl() {
        return '/report-estate-values';
    }

}

module.exports = ReportEstateValues;
