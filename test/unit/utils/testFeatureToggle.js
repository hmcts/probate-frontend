/* eslint-disable max-lines */
'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const FeatureToggle = rewire('app/utils/FeatureToggle');

describe('FeatureToggle', () => {
    describe('checkToggle()', () => {
        it('should call the callback function when the api returns successfully', (done) => {
            const revert = FeatureToggle.__set__('FeatureToggleService', class {
                get() {
                    return Promise.resolve('true');
                }
            });
            const params = {
                req: {
                    session: {
                        form: {}
                    }
                },
                res: {},
                next: () => true,
                featureToggleKey: 'test_toggle',
                callback: sinon.spy()
            };
            const featureToggle = new FeatureToggle();

            featureToggle.checkToggle(params).then(() => {
                expect(params.callback.calledOnce).to.equal(true);
                revert();
                done();
            });
        });

        it('should call next() with an error when the api returns an error', (done) => {
            const revert = FeatureToggle.__set__('FeatureToggleService', class {
                get() {
                    return Promise.reject(new Error());
                }
            });
            const params = {
                req: {
                    session: {
                        form: {}
                    }
                },
                res: {},
                next: sinon.spy(),
                featureToggleKey: 'test_toggle',
                callback: () => true
            };
            const featureToggle = new FeatureToggle();

            featureToggle.checkToggle(params).then(() => {
                expect(params.next.calledOnce).to.equal(true);
                expect(params.next.calledWith(new Error())).to.equal(true);
                revert();
                done();
            });
        });
    });

    describe('togglePage()', () => {
        it('should call next() when isEnabled is set to true', (done) => {
            const params = {
                isEnabled: true,
                res: {},
                next: sinon.spy()
            };
            const featureToggle = new FeatureToggle();

            featureToggle.togglePage(params);

            expect(params.next.calledOnce).to.equal(true);
            expect(params.next.calledWith()).to.equal(true);
            done();
        });

        it('should redirect to the specified page when isEnabled is set to false and the redirectPage arg is a string', (done) => {
            const params = {
                isEnabled: false,
                res: {redirect: sinon.spy()},
                next: {},
                redirectPage: '/applicant-phone'
            };
            const featureToggle = new FeatureToggle();

            featureToggle.togglePage(params);

            expect(params.res.redirect.calledOnce).to.equal(true);
            expect(params.res.redirect.calledWith('/applicant-phone')).to.equal(true);
            done();
        });

        it('should redirect to the specified page when isEnabled is set to false, the redirectPage arg is an object and the case type is GOP', (done) => {
            const params = {
                req: {
                    session: {
                        form: {
                            type: 'gop'
                        }
                    }
                },
                isEnabled: false,
                res: {redirect: sinon.spy()},
                next: {},
                redirectPage: {gop: '/deceased-name', intestacy: '/deceased-details'}
            };
            const featureToggle = new FeatureToggle();

            featureToggle.togglePage(params);

            expect(params.res.redirect.calledOnce).to.equal(true);
            expect(params.res.redirect.calledWith('/deceased-name')).to.equal(true);
            done();
        });

        it('should redirect to the specified page when isEnabled is set to false, the redirectPage arg is an object and the case type is INTESTACY', (done) => {
            const params = {
                req: {
                    session: {
                        form: {
                            type: 'intestacy'
                        }
                    }
                },
                isEnabled: false,
                res: {redirect: sinon.spy()},
                next: {},
                redirectPage: {gop: '/deceased-name', intestacy: '/deceased-details'}
            };
            const featureToggle = new FeatureToggle();

            featureToggle.togglePage(params);

            expect(params.res.redirect.calledOnce).to.equal(true);
            expect(params.res.redirect.calledWith('/deceased-details')).to.equal(true);
            done();
        });
    });

    describe('toggleExistingPage()', () => {
        it('should call next() when isEnabled is set to false', (done) => {
            const params = {
                isEnabled: false,
                res: {},
                next: sinon.spy()
            };
            const featureToggle = new FeatureToggle();

            featureToggle.toggleExistingPage(params);

            expect(params.next.calledOnce).to.equal(true);
            expect(params.next.calledWith()).to.equal(true);
            done();
        });

        it('should redirect to the specified page when isEnabled is set to true, the redirectPage arg is an object and the case type is GOP', (done) => {
            const params = {
                req: {
                    session: {
                        form: {
                            type: 'gop'
                        }
                    }
                },
                isEnabled: true,
                res: {redirect: sinon.spy()},
                next: {},
                redirectPage: {gop: '/deceased-name', intestacy: '/deceased-details'}
            };
            const featureToggle = new FeatureToggle();

            featureToggle.toggleExistingPage(params);

            expect(params.res.redirect.calledOnce).to.equal(true);
            expect(params.res.redirect.calledWith('/deceased-name')).to.equal(true);
            done();
        });

        it('should redirect to the specified page when isEnabled is set to true, the redirectPage arg is an object and the case type is INTESTACY', (done) => {
            const params = {
                req: {
                    session: {
                        form: {
                            type: 'intestacy'
                        }
                    }
                },
                isEnabled: true,
                res: {redirect: sinon.spy()},
                next: {},
                redirectPage: {gop: '/deceased-name', intestacy: '/deceased-details'}
            };
            const featureToggle = new FeatureToggle();

            featureToggle.toggleExistingPage(params);

            expect(params.res.redirect.calledOnce).to.equal(true);
            expect(params.res.redirect.calledWith('/deceased-details')).to.equal(true);
            done();
        });
    });

    describe('toggleFeature()', () => {
        describe('should set the feature toggle', () => {
            it('when the session contains a featureToggles object and call next()', (done) => {
                const params = {
                    req: {session: {featureToggles: {}}},
                    featureToggleKey: 'test_toggle',
                    isEnabled: true,
                    next: sinon.spy()
                };
                const featureToggle = new FeatureToggle();

                featureToggle.toggleFeature(params);

                expect(params.req.session.featureToggles).to.deep.equal({test_toggle: true});
                expect(params.next.calledOnce).to.equal(true);
                expect(params.next.calledWith()).to.equal(true);
                done();
            });

            it('when the session does not contain a featureToggles object and call next()', (done) => {
                const params = {
                    req: {session: {}},
                    featureToggleKey: 'test_toggle',
                    isEnabled: true,
                    next: sinon.spy()
                };
                const featureToggle = new FeatureToggle();

                featureToggle.toggleFeature(params);

                expect(params.req.session.featureToggles).to.deep.equal({test_toggle: true});
                expect(params.next.calledOnce).to.equal(true);
                expect(params.next.calledWith()).to.equal(true);
                done();
            });
        });
    });

    describe('appwideToggles()', () => {
        it('should return ctx when no appwide toggles are present', (done) => {
            const appwideToggles = [];
            const req = {
                session: {
                    featureToggles: {}
                }
            };
            let ctx = {};

            ctx = FeatureToggle.appwideToggles(req, ctx, appwideToggles);

            expect(ctx).to.deep.equal({});
            done();
        });

        it('should add all appwide toggles to ctx when present', (done) => {
            const appwideToggles = ['test_toggle'];
            const req = {
                session: {
                    featureToggles: {
                        test_toggle: false
                    }
                }
            };
            let ctx = {};

            ctx = FeatureToggle.appwideToggles(req, ctx, appwideToggles);

            expect(ctx).to.deep.equal({
                featureToggles: {
                    test_toggle: 'false'
                }
            });
            done();
        });
    });

    describe('isEnabled()', () => {
        describe('should return true', () => {
            it('if the feature toggle exists and is true', (done) => {
                const featureToggles = {test_toggle: true};
                const key = 'test_toggle';
                const isEnabled = FeatureToggle.isEnabled(featureToggles, key);
                expect(isEnabled).to.equal(true);
                done();
            });
        });

        describe('should return false', () => {
            it('if the feature toggle exists and is false', (done) => {
                const featureToggles = {test_toggle: false};
                const key = 'test_toggle';
                const isEnabled = FeatureToggle.isEnabled(featureToggles, key);
                expect(isEnabled).to.equal(false);
                done();
            });

            it('if the feature toggle does not exist', (done) => {
                const featureToggles = {};
                const key = 'test_toggle';
                const isEnabled = FeatureToggle.isEnabled(featureToggles, key);
                expect(isEnabled).to.equal(false);
                done();
            });

            it('if there are no feature toggles', (done) => {
                const featureToggles = '';
                const key = 'test_toggle';
                const isEnabled = FeatureToggle.isEnabled(featureToggles, key);
                expect(isEnabled).to.equal(false);
                done();
            });

            it('if the key is not specified', (done) => {
                const featureToggles = {test_toggle: false};
                const key = '';
                const isEnabled = FeatureToggle.isEnabled(featureToggles, key);
                expect(isEnabled).to.equal(false);
                done();
            });
        });
    });
});
