'use strict';

const config = require('app/config');
const eligibilityCookieName = config.redis.eligibilityCookie.name;
const eligibilityCookieRedirectUrl = config.redis.eligibilityCookie.redirectUrl;

class EligibilityCookie {
    checkCookie() {
        return function (req, res, next) {
            if (!req.cookies[eligibilityCookieName]) {
                res.redirect(eligibilityCookieRedirectUrl);
            } else {
                const eligibilityCookie = JSON.parse(req.cookies[eligibilityCookieName]);

                if (eligibilityCookie.pages.includes(req.originalUrl) || req.originalUrl === eligibilityCookie.nextStepUrl) {
                    next();
                } else {
                    res.redirect(eligibilityCookieRedirectUrl);
                }
            }
        };
    }

    setCookie(req, res, nextStepUrl) {
        const json = this.readCookie(req);
        const currentPage = req.originalUrl;

        json.nextStepUrl = nextStepUrl;
        if (!json.pages.includes(currentPage)) {
            json.pages.push(currentPage);
        }

        this.writeCookie(req, res, json);
    }

    readCookie(req) {
        let json = {
            nextStepUrl: '',
            pages: []
        };

        if (req.cookies && req.cookies[eligibilityCookieName]) {
            json = JSON.parse(req.cookies[eligibilityCookieName]);
        }

        return json;
    }

    writeCookie(req, res, json) {
        const cookieValue = JSON.stringify(json);

        if (req.protocol === 'https') {
            res.cookie(eligibilityCookieName, cookieValue, {secure: true, httpOnly: true});
        } else {
            res.cookie(eligibilityCookieName, cookieValue, {httpOnly: true});
        }
    }
}

module.exports = EligibilityCookie;
