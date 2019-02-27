'use strict';

const config = require('app/config');
const eligibilityCookieName = config.redis.eligibilityCookie.name;
const eligibilityCookieRedirectUrl = config.redis.eligibilityCookie.redirectUrl;
const cookieExpires = new Date(Date.now() + config.redis.eligibilityCookie.expires);

class EligibilityCookie {
    checkCookie() {
        return (req, res, next) => {
            if (!req.cookies[eligibilityCookieName]) {
                res.redirect(eligibilityCookieRedirectUrl);
            } else {
                const eligibilityCookie = JSON.parse(req.cookies[eligibilityCookieName]);
                const pageFound = Object.keys(eligibilityCookie.pages).includes(req.originalUrl);

                if (pageFound || req.originalUrl === eligibilityCookie.nextStepUrl) {
                    next();
                } else {
                    res.redirect(eligibilityCookieRedirectUrl);
                }
            }
        };
    }

    setCookie(req, res, nextStepUrl, fieldKey, fieldValue) {
        const json = this.readCookie(req);
        const currentPage = req.originalUrl;

        json.nextStepUrl = nextStepUrl;
        json.pages[currentPage] = {};
        json.pages[currentPage][fieldKey] = fieldValue;

        this.writeCookie(req, res, json);
    }

    readCookie(req) {
        let json = {
            nextStepUrl: '',
            pages: {}
        };

        if (req.cookies && req.cookies[eligibilityCookieName]) {
            json = JSON.parse(req.cookies[eligibilityCookieName]);
        }

        return json;
    }

    getAnswer(req, pageUrl, fieldKey) {
        const json = this.readCookie(req);
        const page = json.pages[pageUrl];

        if (page) {
            return page[fieldKey];
        }

        return null;
    }

    writeCookie(req, res, json) {
        const cookieValue = JSON.stringify(json);
        const options = {
            httpOnly: true,
            expires: cookieExpires,
            maxAge: config.redis.eligibilityCookie.expires
        };

        if (req.protocol === 'https') {
            options.secure = true;
        }

        res.cookie(eligibilityCookieName, cookieValue, options);
    }
}

module.exports = EligibilityCookie;
