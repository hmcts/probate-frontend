'use strict';

const config = require('config');

class IhtThreshold {
    static getIhtThreshold(date) {
        const ranges = config.assetsValueThreshold;
        date = new Date(date);
        let threshold = null;

        ranges.forEach(range => {
            if (!threshold) {
                if (range.minDate && range.maxDate && date >= new Date(range.minDate) && date <= new Date(range.maxDate)) {
                    threshold = range.value;
                } else if (range.minDate && !range.maxDate && date >= new Date(range.minDate)) {
                    threshold = range.value;
                } else if (!range.minDate && range.maxDate && date <= new Date(range.maxDate)) {
                    threshold = range.value;
                }
            }
        });

        return threshold;
    }
}

module.exports = IhtThreshold;
