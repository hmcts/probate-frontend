const {forEach, filter, isEmpty, set, get, cloneDeep} = require('lodash'),
    {expect, assert} = require('chai'),
    app = require('app'),
    routes = require('app/routes'),
    config = require('app/config'),
    request = require('supertest'),
    journeyMap = require('app/core/journeyMap'),
    {steps} = require('app/core/initSteps');

module.exports = class TestWrapper {
    constructor(stepName) {
        this.pageToTest = steps[stepName];
        this.pageUrl = this.pageToTest.constructor.getUrl();

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

        config.useCSRFProtection = 'false';
        this.server = app.init();
        this.agent = request.agent(this.server.app);
    }

    testContent(done, excludeKeys = [], data) {
        const contentToCheck = cloneDeep(filter(this.content, (value, key) => !excludeKeys.includes(key) && key !== 'errors'));
        this.substituteContent(data, contentToCheck);
        this.agent.get(this.pageUrl)
            .expect('Content-type', /html/)
            .then(response => {
                this.assertContentIsPresent(response.text, contentToCheck);
                done();
            })
            .catch(done);
    }

    testDataPlayback(done, data) {
        this.agent.get(this.pageUrl)
            .expect('Content-type', /html/)
            .then(response => {
                this.assertContentIsPresent(response.text, data);
                done();
            })
            .catch(done);
    }

    testErrors(done, data, type, onlyKeys = []) {
        const contentErrors = get(this.content, 'errors', {});
        const expectedErrors = cloneDeep(isEmpty(onlyKeys) ? contentErrors : filter(contentErrors, (value, key) => onlyKeys.includes(key)));
        assert.isNotEmpty(expectedErrors);
        this.substituteErrorsContent(data, expectedErrors, type);
            this.agent.post(`${this.pageUrl}`)
            .type('form')
            .send(data)
            .expect('Content-type', 'text/html; charset=utf-8')
            .then(res => {
                forEach(expectedErrors, (value) => {
                    expect(res.text).to.contain(value[type].summary);
                    expect(res.text).to.contain(value[type].message);
                });
                done();
            })
            .catch(done);
    }

    testRedirect(done, postData, expectedNextUrl) {
        this.agent.post(this.pageUrl)
            .type('form')
            .send(postData)
            .expect('location', expectedNextUrl)
            .expect(302)
            .then(() => done())
            .catch(done);
    }

    nextStep(data = {}) {
        return journeyMap(this.pageToTest, data);
    }

    substituteContent(data, contentToSubstitute) {
        Object.entries(contentToSubstitute)
            .forEach(([key, contentValue]) => {
                forEach(contentValue.match(/\{(.*?)\}/g), (placeholder) => {
                    const placeholderRegex = new RegExp(placeholder, 'g');
                    placeholder = placeholder.replace(/[{}]/g, '');
                    contentValue = contentValue.replace(placeholderRegex, data[placeholder]);
                });
                contentToSubstitute[key] = contentValue;
            });
    }

    substituteErrorsContent(data, contentToSubstitute, type) {
        Object.entries(contentToSubstitute)
            .forEach(([key, contentValue]) => {
                forEach(contentValue[type], (errorMessageItem) => {
                    let placeholder = errorMessageItem.match(/\{(.*?)\}/g);
                    if (placeholder) {
                        const placeholderRegex = new RegExp(placeholder, 'g');
                        placeholder = placeholder.replace(/[{}]/g, '');
                        errorMessageItem = errorMessageItem.replace(placeholderRegex, data[placeholder]);
                        contentToSubstitute[key][type] = errorMessageItem;
                    }
                });
            });
    }

    assertContentIsPresent(actualContent, expectedContent) {
        forEach(expectedContent, (value) => {
            expect(actualContent.toLowerCase()).to.contain(value.toString().toLowerCase());
        });
    }

    destroy() {
        this.server.http.close();
    }
};
