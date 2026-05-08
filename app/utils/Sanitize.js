'use strict';

class Sanitize {
    static sanitizeInput(input) {
        if (input === null || typeof input !== 'object' || Array.isArray(input)) {
            return input;
        }

        const sanitized = {};

        for (const key of Object.keys(input)) {
            if (!['__proto__', 'constructor', 'prototype'].includes(key)) {
                sanitized[key] = input[key];
            }
        }
        return sanitized;
    }
}

module.exports = Sanitize;
