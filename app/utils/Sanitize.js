'use strict';

class Sanitize {
    static sanitizeInput(input) {
        if (input === null || typeof input !== 'object') {
            return input;
        }

        if (Array.isArray(input)) {
            return input.map(item => Sanitize.sanitizeInput(item));
        }

        const sanitized = {};

        for (const key of Object.keys(input)) {
            if (!['__proto__', 'constructor', 'prototype'].includes(key)) {
                sanitized[key] = Sanitize.sanitizeInput(input[key]);
            }
        }

        return sanitized;
    }
}

module.exports = Sanitize;
