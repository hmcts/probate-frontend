'use strict';

const DocumentsWrapper = require('app/wrappers/Documents');
const expect = require('chai').expect;
const caseTypes = require('app/utils/CaseTypes');

describe('Documents.js', () => {
    describe('documentsSent()', () => {
        it('should return true if documents have been sent', (done) => {
            const data = {sentDocuments: 'true'};
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsSent()).to.equal(true);
            done();
        });

        it('should return false if the documents have not been sent', (done) => {
            const data = {sentDocuments: 'false'};
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsSent()).to.equal(false);
            done();
        });
    });

    describe('documentsRequired()', () => {
        it('should return false when no data', (done) => {
            const data = {};
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired()).to.equal(false);
            done();
        });

        it('should return true when case is GOP', (done) => {
            const data = {caseType: caseTypes.GOP};
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired()).to.equal(true);
            done();
        });

        it('should return true when case is INTESTACY with optionMarried and optionAdoptedChild', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried'
                },
                applicant: {
                    relationshipToDeceased: 'optionAdoptedChild'
                },
                documents: {
                    uploads: ['content']
                }
            };
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired()).to.equal(true);
            done();
        });

        it('should return true when case is INTESTACY with iht205 used', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                documents: {
                    uploads: ['content']
                },
                iht: {
                    form: 'optionIHT205',
                    method: 'optionPaper'
                }
            };
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired()).to.equal(true);
            done();
        });

        it('should return true when case is INTESTACY with iht207 used', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                documents: {
                    uploads: ['content']
                },
                iht: {
                    form: 'optionIHT207',
                    method: 'optionPaper'
                }
            };
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired()).to.equal(true);
            done();
        });

        it('should return false when case is INTESTACY with no documents uploaded, iht205 form not used, marital status not married and relationship to deceased not child', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionDivorced'
                },
                iht: {
                    method: 'optionOnline'
                },
                documents: {
                    uploads: ['content']
                }
            };
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired()).to.equal(false);
            done();
        });

        it('should return false when intestacy document screening conditions are met, death certifcate option and iht400 chosen Dod before 1/1/2022', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried',
                    deathCertificate: 'optionDeathCertificate'
                },
                applicant: {
                    relationshipToDeceased: 'optionSpousePartner'
                },
                iht: {
                    form: 'optionIHT400'
                }
            };
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired()).to.equal(false);
            done();
        });

        it('should return true when intestacy, iht207, Dod on or after 1/1/2022', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried',
                    deathCertificate: 'optionDeathCertificate'
                },
                applicant: {
                    relationshipToDeceased: 'optionSpousePartner'
                },
                iht: {
                    ihtFormEstateId: 'optionIHT207'
                }
            };
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired()).to.equal(true);
            done();
        });

        it('should return false when intestacy document screening conditions are met, death certifcate option and iht400 chosen, Dod on or after 1/1/2022', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried',
                    deathCertificate: 'optionDeathCertificate'
                },
                applicant: {
                    relationshipToDeceased: 'optionSpousePartner'
                },
                iht: {
                    ihtFormEstateId: 'optionIHT400421'
                }
            };
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired()).to.equal(false);
            done();
        });

        it('should return false when intestacy document screening conditions are met, death certifcate option and excepted estate', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried',
                    deathCertificate: 'optionDeathCertificate'
                },
                applicant: {
                    relationshipToDeceased: 'optionSpousePartner'
                },
                iht: {
                    estateValueCompleted: 'optionNo'
                }
            };
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired()).to.equal(false);
            done();
        });

        it('should return true when intestacy document screening conditions are met, interim death certifcate option and excepted estate', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried',
                    deathCertificate: 'optionInterimCertificate'
                },
                applicant: {
                    relationshipToDeceased: 'optionSpousePartner'
                },
                iht: {
                    estateValueCompleted: 'optionNo'
                }
            };
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired()).to.equal(true);
            done();
        });
    });

    //DTSPB-529 Tests duplicated for new probate death cert flow.
    describe('documentsRequired_new_death_cert_flow()', () => {
        const ftValue = {
            'ft_new_deathcert_flow': true
        };

        it('should return false when no data', (done) => {
            const data = {};
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired(ftValue)).to.equal(false);
            done();
        });

        it('should return true when case is GOP', (done) => {
            const data = {caseType: caseTypes.GOP};
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired(ftValue)).to.equal(true);
            done();
        });

        it('should return true when case is INTESTACY with optionMarried and optionAdoptedChild', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried'
                },
                applicant: {
                    relationshipToDeceased: 'optionAdoptedChild'
                }
            };
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired(ftValue)).to.equal(true);
            done();
        });

        it('should return true when case is INTESTACY with iht205 used', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                iht: {
                    form: 'optionIHT205',
                    method: 'optionPaper'
                }
            };
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired(ftValue)).to.equal(true);
            done();
        });

        it('should return true when case is INTESTACY with interim death certificate', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    deathCertificate: 'optionInterimCertificate',
                    diedEngOrWales: 'optionYes'
                }
            };
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired(ftValue)).to.equal(true);
            done();
        });

        it('should return true when case is INTESTACY with foreign death certificate', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    diedEngOrWales: 'optionNo'
                }
            };
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired(ftValue)).to.equal(true);
            done();
        });

        it('should return false when case is INTESTACY with iht205 form not used, marital status not married, relationship to deceased not child and english death certificate', (done) => {
            const data = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionDivorced',
                    diedEngOrWales: 'optionYes',
                    deathCertificate: 'optionDeathCertificate'
                },
                iht: {
                    method: 'optionOnline'
                }
            };
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.documentsRequired(ftValue)).to.equal(false);
            done();
        });
    });
});
