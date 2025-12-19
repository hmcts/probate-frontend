'use strict';

const TestWrapper = require('test/util/TestWrapper');
const testCommonContent = require('test/component/common/testCommonContent.js');
const DeathCertificateInterim = require('app/steps/ui/deceased/deathcertificate');
const EnglishForeignDeathCert = require('app/steps/ui/deceased/englishforeigndeathcert');

describe('died-eng-or-wales', () => {
    let testWrapper;
    const expectedNextUrlForDeathCertificateInterim = DeathCertificateInterim.getUrl();
    const expectedNextUrlForEnglishForeignDeathCert = EnglishForeignDeathCert.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DiedEnglandOrWales');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DiedEnglandOrWales');

        it('test right content loaded on the page: ENGLISH', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };
            const contentToExclude = ['theDeceased'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page: WELSH', (done) => {
            const sessionData = {
                form: {
                    ccdCase: {
                        state: 'Pending',
                        id: 1234567890123456
                    },
                    deceased: {
                        firstName: 'John',
                        lastName: 'Doe'
                    }
                },
                language: 'cy'
            };
            const contentToExclude = ['theDeceased'];

            testWrapper.agent.post('/prepare-session-field')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, contentData, contentToExclude, [], 'cy');
                });
        });

        it('test domicile schema validation when no data is entered', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to death certificate interim page: ${expectedNextUrlForDeathCertificateInterim}`, (done) => {
            const data = {
                diedEngOrWales: 'optionYes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeathCertificateInterim);
        });

        it(`test it redirects to iht method page: ${expectedNextUrlForEnglishForeignDeathCert}`, (done) => {
            const data = {
                diedEngOrWales: 'optionNo'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForEnglishForeignDeathCert);
        });
    });
});
