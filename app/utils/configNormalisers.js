'use strict';

const logger = require('app/components/logger')('Init');

function normalizeNonIdamPages(input) {
    if (Array.isArray(input)) {
        return input;
    }

    if (typeof input === 'string' && input.trim() !== '') {
        try {
            const parsed = JSON.parse(input);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (err) {
            logger.warn({err}, 'Error parsing NON_IDAM_PAGES');
            throw new Error('NON_IDAM_PAGES is not valid JSON');
        }
    }
    logger.warn('NON_IDAM_PAGES is not valid array or JSON. Aborting startup');
    throw new Error('Missing or invalid NON_IDAM_PAGES configuration. Aborting startup.');
}

module.exports = normalizeNonIdamPages;
