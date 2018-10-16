'use strict';

const ELIGIBILITY_COOKIE = '__eligibility';

class EligibilityCookie {
    checkCookie() {
        return function (req, res, next) {
            if (!req.cookies[ELIGIBILITY_COOKIE]) {
                res.redirect('/start-eligibility');
            } else {
                const eligibilityCookie = JSON.parse(req.cookies[ELIGIBILITY_COOKIE]);

                if (!eligibilityCookie.pages.includes(req.originalUrl) && req.originalUrl !== eligibilityCookie.nextStepUrl) {
                    res.redirect('/start-eligibility');
                } else {
                    next();
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

        if (req.cookies && req.cookies[ELIGIBILITY_COOKIE]) {
            json = JSON.parse(req.cookies[ELIGIBILITY_COOKIE]);
        }

        return json;
    }

    writeCookie(req, res, json) {
        const cookieValue = JSON.stringify(json);

        if (req.protocol === 'https') {
            res.cookie(ELIGIBILITY_COOKIE, cookieValue, {secure: true, httpOnly: true});
        } else {
            res.cookie(ELIGIBILITY_COOKIE, cookieValue, {httpOnly: true});
        }
    }
}

module.exports = EligibilityCookie;
