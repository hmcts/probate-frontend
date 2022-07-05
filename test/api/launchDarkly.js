'use strict';

const sinon = require('sinon');
const FeatureToggle = require('app/utils/FeatureToggle');
const {expect} = require('chai');

describe('launchDarkly tests', () => {
    describe('checkToggle()', () => {
        it('should check excepted estates feature toggle', (done) => {
            const params = {
                req: {
                    session: {
                        form: {}
                    }
                },
                res: {},
                next: () => true,
                redirectPage: '/dummy-page',
                launchDarkly: {
                    ftValue: {'ft_excepted_estates': 'defaultValue'}
                },
                featureToggleKey: 'ft_excepted_estates',
                callback: sinon.spy()
            };
            const featureToggle = new FeatureToggle();

            featureToggle.checkToggle(params);

            setTimeout(() => {
                expect(params.callback.calledWith({
                    req: params.req,
                    res: params.res,
                    next: params.next,
                    redirectPage: params.redirectPage,
                    isEnabled: true,
                    featureToggleKey: params.featureToggleKey
                })).to.equal(true);

                done();
            }, 1000);
        });
    });

});
