'use strict';

const config = require('config');

const isLanguageAvailable = (lang) => {
    return config.languages.includes(lang);
};

const getAvailableLanguageFromQueryParams = (queryParam) => {
    if (queryParam) {
        if (!Array.isArray(queryParam)) {
            queryParam = [queryParam];
        }

        return queryParam.find(isLanguageAvailable);
    }
};

const setLanguageForSession = (req, res, next) => {
    if (!req.session.language) {
        req.session.language = 'en';
    }

    if (req.query) {
        const fromLng = getAvailableLanguageFromQueryParams(req.query.lng);
        const fromLocale = getAvailableLanguageFromQueryParams(req.query.locale);
        if (fromLng) {
            req.session.language = fromLng;
        } else if (fromLocale) {
            req.session.language = fromLocale;
        }
    }
    next();
};

module.exports = setLanguageForSession;
