'use strict';

const {forEach, filter, isEmpty, set, get, cloneDeep} = require('lodash');
const {expect, assert} = require('chai');

const routes = require('app/routes');
const config = require('config');

const request = require('supertest');
const JourneyMap = require('app/core/JourneyMap');
const initSteps = require('app/core/initSteps');
const probateJourney = require('app/journeys/probate');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`], 'en');
const {createHttpTerminator} = require ('http-terminator');

class TestWrapper {
    constructor(stepName, ftValue, journey = probateJourney) {
        this.pageToTest = steps[stepName];
        this.pageUrl = this.pageToTest.constructor.getUrl();
        this.journey = journey;

        this.content = require(`app/resources/en/translation/${this.pageToTest.resourcePath}`);
        routes.post('/prepare-session/:path', (req, res) => {
            set(req.session, req.params.path, req.body);
            res.send('OK');
        });
        routes.post('/prepare-session-field', (req, res) => {
            Object.assign(req.session, req.body);
            res.send('OK');
        });
        routes.post('/prepare-session-field/:field/:value', (req, res) => {
            set(req.session, req.params.field, req.params.value);
            res.send('OK');
        });

        config.app.useCSRFProtection = 'false';
        const app = require('app');
        this.server = app.init(false, {}, ftValue);
        this.httpTerminator = createHttpTerminator({server: this.server.http});
        this.agent = request.agent(this.server.app);
    }

    testContent(done, data = {}, excludeKeys = [], cookies = []) {
        let res = null;
        let substitutedContent = null;
        try {
            const contentToCheck = cloneDeep(filter(this.content, (value, key) => !excludeKeys.includes(key) && key !== 'errors'));
            substitutedContent = this.substituteContent(data, contentToCheck);
            res = this.agent.get(this.pageUrl);

            if (cookies.length) {
                const cookiesString = this.setCookiesString(res, cookies);
                res.set('Cookie', cookiesString);
            }
        } catch (err) {
            console.error(`Error in testContent: ${err.message}`);
            done(err);
            return;
        }

        try {
            if (!res) {
                done(new Error('agent.get failed'));
                return;
            }
            if (!substitutedContent) {
                done(new Error('substitutedContent null'));
                return;
            }
            // this will actually hang if launch darkly key not substituted correctly, and timeout
            res.expect('Content-type', /html/)
                .then(response => {
                    try {
                        this.assertContentIsPresent(response.text, substitutedContent);
                        done();
                    } catch (err) {
                        console.error(`Assert content present error: ${err.message}\nStack:\n${err.stack}`);
                        done(err);
                    }
                })
                .catch((err) => {
                    console.error(`Chai response error: ${err.message}\nStack:\n${err.stack}`);
                    done(err);
                });
        } catch (err) {
            console.error(`Error in testContent (res.expect): ${err.message}`);
            done(err);
        }
    }

    testDataPlayback(done, data = {}, excludeKeys = [], cookies = []) {
        const dataToCheck = cloneDeep(filter(data, (value, key) => !excludeKeys.includes(key) && key !== 'errors'));
        const res = this.agent.get(this.pageUrl);

        if (cookies.length) {
            const cookiesString = this.setCookiesString(res, cookies);
            res.set('Cookie', cookiesString);
        }

        res.expect('Content-type', /html/)
            .then(response => {
                this.assertContentIsPresent(response.text, dataToCheck);
                done();
            })
            .catch((err) => done(err));
    }

    testContentPresent(done, data) {
        this.agent.get(this.pageUrl)
            .then(response => {
                this.assertContentIsPresent(response.text, data);
                done();
            })
            .catch((err) => done(err));
    }

    testContentNotPresent(done, data) {
        this.agent.get(this.pageUrl)
            .then(response => {
                this.assertContentIsNotPresent(response.text, data);
                done();
            })
            .catch((err) => done(err));
    }

    testErrors(done, data, type, onlyKeys = [], cookies = []) {
        const contentErrors = get(this.content, 'errors', {});
        const expectedErrors = cloneDeep(isEmpty(onlyKeys) ? contentErrors : filter(contentErrors, (value, key) => onlyKeys.includes(key)));
        assert.isNotEmpty(expectedErrors);
        this.substituteErrorsContent(data, expectedErrors, type);
        const res = this.agent.post(`${this.pageUrl}`);

        if (cookies.length) {
            const cookiesString = this.setCookiesString(res, cookies);
            res.set('Cookie', cookiesString);
        }

        res.type('form')
            .send(data)
            .expect('Content-type', 'text/html; charset=utf-8')
            .then(res => {
                forEach(expectedErrors, (value) => {
                    expect(res.text).to.contain(value[type]);
                });
                done();
            })
            .catch((err) => done(err));
    }

    testContentAfterError(data, contentToCheck, done) {
        this.agent.post(this.pageUrl)
            .send(data)
            .expect('Content-type', 'text/html; charset=utf-8')
            .then(res => {
                this.assertContentIsPresent(res.text, contentToCheck);
                done();
            })
            .catch((err) => done(err));
    }

    testRedirect(done, data, expectedNextUrl, cookies = []) {
        const res = this.agent.post(this.pageUrl);

        if (cookies.length) {
            const cookiesString = this.setCookiesString(res, cookies);
            res.set('Cookie', cookiesString);
        }

        res.type('form')
            .send(data)
            .expect('location', expectedNextUrl)
            .expect(302)
            .then(() => done())
            .catch((err) => done(err));
    }

    nextStep(data = {}) {
        const journeyMap = new JourneyMap(this.journey);
        return journeyMap.nextStep(this.pageToTest, data);
    }

    substituteContent(data, contentToSubstitute) {
        Object.entries(contentToSubstitute)
            .forEach(([key, contentValue]) => {
                contentValue = contentValue.replace(/\n/g, '<br />\n');
                const contentValueMatch = contentValue.match(/{(.*?)}/g);
                if (contentValueMatch) {
                    contentValueMatch.forEach(placeholder => {
                        const placeholderRegex = new RegExp(placeholder, 'g');
                        placeholder = placeholder.replace(/[{}]/g, '');
                        if (Array.isArray(data[placeholder])) {
                            data[placeholder].forEach(contentData => {
                                const contentValueReplace = contentValue.replace(placeholderRegex, contentData);
                                contentToSubstitute.push(contentValueReplace);
                            });
                            contentToSubstitute[key] = 'undefined';
                        } else {
                            contentValue = contentValue.replace(placeholderRegex, data[placeholder]);
                            contentToSubstitute[key] = contentValue;
                        }
                    });
                } else {
                    contentToSubstitute[key] = contentValue;
                }
            });
        return contentToSubstitute.filter(content => content !== 'undefined');
    }

    substituteErrorsContent(data, contentToSubstitute, type) {
        Object.entries(contentToSubstitute).forEach(([contentKey, contentValue]) => {
            const errorMessageValueMatch = contentValue[type].match(/{(.*?)}/g);
            if (errorMessageValueMatch) {
                errorMessageValueMatch.forEach(placeholder => {
                    const placeholderRegex = new RegExp(placeholder, 'g');
                    contentToSubstitute[contentKey][type] = contentToSubstitute[contentKey][type].replace(placeholderRegex, data[placeholder]);
                });
            }
        });
    }

    assertContentIsPresent(actualContent, expectedContent) {
        expectedContent.forEach(contentValue => {
            expect(actualContent.toLowerCase()).to.contain(contentValue.toString().toLowerCase());
        });
    }

    assertContentIsNotPresent(actualContent, expectedContent) {
        forEach(expectedContent, (contentValue) => {
            expect(actualContent.toLowerCase()).to.not.contain(contentValue.toString().toLowerCase());
        });
    }

    setCookiesString(res, cookies = []) {
        if (cookies.length) {
            let cookiesString;

            for (let i=0; i<cookies.length; i++) {
                const cookieName = cookies[i].name;
                const cookieContent = JSON.stringify(cookies[i].content);
                cookiesString = `${cookieName}=${cookieContent},`;
            }

            cookiesString = cookiesString.substring(0, cookiesString.length - 1);

            return cookiesString;
        }

        return '';
    }

    async destroy() {
        await this.httpTerminator.terminate();
    }
}

module.exports = TestWrapper;
