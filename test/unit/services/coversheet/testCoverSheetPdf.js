'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const CoverSheetPdf = require('app/services/CoverSheetPdf');
const Pdf = require('app/services/Pdf');
const config = require('config');

let postStub;

describe('CoverSheetPdfService', () => {
    describe('post()', () => {

        afterEach(() => {
            postStub.restore();
        });

        it('should call super.post()', (done) => {
            const endpoint = 'http://localhost';
            const formdata = {
                caseType: 'gop',
                language: {
                    bilingual: 'optionNo'
                },
                applicant: {
                    firstName: 'Joe',
                    lastName: 'Bloggs',
                    address: {
                        formattedAddress: '1 Red Road, London, L1 1LL'
                    }
                },
                ccdCase: {
                    id: 'ccd123'
                },
                registry: {
                    address: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY'
                }
            };
            const coverSheetPdf = new CoverSheetPdf(endpoint, 'abc123');
            postStub = sinon.stub(Pdf.prototype, 'post');

            const req = {
                session: {
                    form: formdata,
                    language: 'en'
                }
            };

            coverSheetPdf.post(req);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                config.pdf.template.coverSheet,
                {
                    applicantAddress: '1 Red Road, London, L1 1LL',
                    isBilingual: false,
                    applicantName: 'Joe Bloggs',
                    caseReference: 'ccd123',
                    submitAddress: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY',
                    checkListItems: [
                        {text: 'the original will (by law, we must keep your original will as it becomes a public document)', type: 'textOnly'}],
                    checkListItemsWelsh: [
                        {text: 'yr ewyllys wreiddiol (yn ôl y gyfraith, rhaid i ni gadw\'r ewyllys wreiddiol wrth iddi ddod yn ddogfen gyhoeddus)', type: 'textOnly'}],
                    noDocumentsRequired: false,
                    noDocumentsRequiredText: null,
                    noDocumentsRequiredTextWelsh: null
                },
                'Post cover sheet pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });

        it('should call super.post() and call with relevant checklist items', (done) => {
            const endpoint = 'http://localhost';
            const formdata = {
                caseType: 'intestacy',
                language: {
                    bilingual: 'optionNo'
                },
                applicant: {
                    firstName: 'Joe',
                    lastName: 'Bloggs',
                    address: {
                        formattedAddress: '1 Red Road, London, L1 1LL'
                    },
                    relationshipToDeceased: 'optionChild',
                    spouseNotApplyingReason: 'optionRenouncing'
                },
                ccdCase: {
                    id: 'ccd123'
                },
                registry: {
                    address: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY'
                },
                deceased: {
                    maritalStatus: 'optionMarried',
                    anyOtherChildren: 'optionNo'
                },
            };
            const coverSheetPdf = new CoverSheetPdf(endpoint, 'abc123');
            postStub = sinon.stub(Pdf.prototype, 'post');

            const req = {
                session: {
                    form: formdata,
                    language: 'en'
                }
            };

            coverSheetPdf.post(req);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                config.pdf.template.coverSheet,
                {
                    applicantAddress: '1 Red Road, London, L1 1LL',
                    isBilingual: false,
                    applicantName: 'Joe Bloggs',
                    caseReference: 'ccd123',
                    submitAddress: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY',
                    checkListItems: [
                        {text: 'renunciation form (opens in a new tab)', type: 'textWithLink', url: config.links.spouseGivingUpAdminRightsPA16Link, beforeLinkText: 'a ', afterLinkText: ' filled in by the spouse or civil partner of the deceased who is permanently giving up the right to make this application for probate'},
                    ],
                    checkListItemsWelsh: [
                        {text: 'ffurflen ymwrthod (yn agor mewn tab newydd)', type: 'textWithLink', url: config.links.spouseGivingUpAdminRightsPA16Link, beforeLinkText: 'a ', afterLinkText: ' wedi&rsquo;i llenwi gan &wcirc;r/gwraig neu bartner sifil yr unigolyn sydd wedi marw sy&rsquo;n rhoi fyny yr hawl yn barhaol i wneud y cais hwn am brofiant'},
                    ],
                    noDocumentsRequired: false,
                    noDocumentsRequiredText: null,
                    noDocumentsRequiredTextWelsh: null
                },
                'Post cover sheet pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });

        it('should call super.post() and call with relevant checklist items when applicant is adopted child and other children exist', (done) => {
            const endpoint = 'http://localhost';
            const formdata = {
                caseType: 'intestacy',
                language: {
                    bilingual: 'optionNo'
                },
                applicant: {
                    firstName: 'Joe',
                    lastName: 'Bloggs',
                    address: {
                        formattedAddress: '1 Red Road, London, L1 1LL'
                    },
                    relationshipToDeceased: 'optionAdoptedChild',
                    spouseNotApplyingReason: 'optionRenouncing'
                },
                ccdCase: {
                    id: 'ccd123'
                },
                registry: {
                    address: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY'
                },
                deceased: {
                    maritalStatus: 'optionMarried',
                    anyOtherChildren: 'optionYes'
                },
            };
            const coverSheetPdf = new CoverSheetPdf(endpoint, 'abc123');
            postStub = sinon.stub(Pdf.prototype, 'post');

            const req = {
                session: {
                    form: formdata,
                    language: 'en'
                }
            };

            coverSheetPdf.post(req);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                config.pdf.template.coverSheet,
                {
                    applicantAddress: '1 Red Road, London, L1 1LL',
                    isBilingual: false,
                    applicantName: 'Joe Bloggs',
                    caseReference: 'ccd123',
                    submitAddress: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY',
                    checkListItems: [
                        {text: 'renunciation form (opens in a new tab)', type: 'textWithLink', url: config.links.spouseGivingUpAdminRightsPA16Link, beforeLinkText: 'a ', afterLinkText: ' filled in by the spouse or civil partner of the deceased who is permanently giving up the right to make this application for probate'},
                    ],
                    checkListItemsWelsh: [
                        {text: 'ffurflen ymwrthod (yn agor mewn tab newydd)', type: 'textWithLink', url: config.links.spouseGivingUpAdminRightsPA16Link, beforeLinkText: 'a ', afterLinkText: ' wedi&rsquo;i llenwi gan &wcirc;r/gwraig neu bartner sifil yr unigolyn sydd wedi marw sy&rsquo;n rhoi fyny yr hawl yn barhaol i wneud y cais hwn am brofiant'},
                    ],
                    noDocumentsRequired: false,
                    noDocumentsRequiredText: null,
                    noDocumentsRequiredTextWelsh: null
                },
                'Post cover sheet pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });

        it('should call super.post() and call with Codicils checklist items', (done) => {
            const endpoint = 'http://localhost';
            const formdata = {
                caseType: 'gop',
                language: {
                    bilingual: 'optionNo'
                },
                applicant: {
                    firstName: 'Joe',
                    lastName: 'Bloggs',
                    address: {
                        formattedAddress: '1 Red Road, London, L1 1LL'
                    },
                    relationshipToDeceased: 'optionChild',
                    spouseNotApplyingReason: 'optionRenouncing'
                },
                ccdCase: {
                    id: 'ccd123'
                },
                registry: {
                    address: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY'
                },
                will: {
                    codicils: 'optionYes',
                    codicilsNumber: 12345,
                    deceasedWrittenWishes: 'optionYes'
                },
                deceased: {
                    deathCertificate: 'optionInterimCertificate',
                    foreignDeathCertTranslation: 'optionNo'
                },
            };
            const coverSheetPdf = new CoverSheetPdf(endpoint, 'abc123');
            postStub = sinon.stub(Pdf.prototype, 'post');

            const req = {
                session: {
                    form: formdata,
                    language: 'en'
                }
            };

            coverSheetPdf.post(req);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                config.pdf.template.coverSheet,
                {
                    applicantAddress: '1 Red Road, London, L1 1LL',
                    isBilingual: false,
                    applicantName: 'Joe Bloggs',
                    caseReference: 'ccd123',
                    submitAddress: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY',
                    checkListItems: [
                        {text: 'the original will and any codicils (by law, we must keep your original will as it becomes a public document)', type: 'textOnly'},
                        {text: 'any written wishes', type: 'textOnly'},
                        {text: 'the interim death certificate', type: 'textOnly'},
                        {text: 'the English translation of the foreign death certificate', type: 'textOnly'},
                        {text: 'Foreign death certificate form (opens in a new tab)', type: 'textWithLink', url: 'https://www.gov.uk/government/publications/form-pa19-apply-for-a-grant-of-representation-with-a-foreign-death-certificate-not-translated-by-a-licensed-company', beforeLinkText: 'either a completed PA19 - ', afterLinkText: ' or a certificate from the translator confirming the translation\'s validity'}
                    ],
                    checkListItemsWelsh: [
                        {text: 'yr ewyllys wreiddiol ac unrhyw godisiliau (yn ôl y gyfraith, rhaid i ni gadw&rsquo;r ewyllys wreiddiol wrth iddi ddod yn ddogfen gyhoeddus)', type: 'textOnly'},
                        {text: 'unrhyw ddymuniadau ysgrifenedig', type: 'textOnly'},
                        {text: 'y dystysgrif marwolaeth dros dro', type: 'textOnly'},
                        {text: 'cyfieithiad Saesneg o’r dystysgrif marwolaeth dramor', type: 'textOnly'},
                        {text: 'wedi ei llenwi (yn agor mewn tab newydd)', type: 'textWithLink', url: 'https://www.gov.uk/government/publications/form-pa19-apply-for-a-grant-of-representation-with-a-foreign-death-certificate-not-translated-by-a-licensed-company', beforeLinkText: 'naill ai ffurflen dystysgrif marwolaeth dramor PA19 - ', afterLinkText: ' neu dystysgrif gan gyfieithydd yn cadarnhau dilysrwydd y cyfieithiad'}
                    ],
                    noDocumentsRequired: false,
                    noDocumentsRequiredText: null,
                    noDocumentsRequiredTextWelsh: null
                },
                'Post cover sheet pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });
        it('should call super.post() and call with death certificate & IHT 205 checklist items', (done) => {
            const endpoint = 'http://localhost';
            const formdata = {
                caseType: 'gop',
                language: {
                    bilingual: 'optionNo'
                },
                applicant: {
                    firstName: 'Joe',
                    lastName: 'Bloggs',
                    address: {
                        formattedAddress: '1 Red Road, London, L1 1LL'
                    },
                    relationshipToDeceased: 'optionChild',
                    spouseNotApplyingReason: 'optionRenouncing'
                },
                ccdCase: {
                    id: 'ccd123'
                },
                registry: {
                    address: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY'
                },
                deceased: {
                    diedEngOrWales: 'optionNo',
                    'dod-date': '2018-01-01'
                },
                iht: {
                    method: 'optionPaper',
                    form: 'optionIHT205'
                },
                executors: {
                    list: [
                        {firstName: 'Executor Name 0', lastName: 'TheApplicant', isApplying: true, isApplicant: true, aliasReason: 'optionDeedPoll', currentName: 'Executor current Name 1'},
                        {fullName: 'Executor Name 1', hasOtherName: false},
                        {fullName: 'Executor Name 2', hasOtherName: true},
                        {fullName: 'Executor Name 3', hasOtherName: false, aliasReason: 'optionDeedPoll', currentName: 'Executor current Name 3'}
                    ]
                }
            };
            const coverSheetPdf = new CoverSheetPdf(endpoint, 'abc123');
            postStub = sinon.stub(Pdf.prototype, 'post');

            const req = {
                session: {
                    form: formdata,
                    language: 'en'
                }
            };

            coverSheetPdf.post(req);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                config.pdf.template.coverSheet,
                {
                    applicantAddress: '1 Red Road, London, L1 1LL',
                    isBilingual: false,
                    applicantName: 'Joe Bloggs',
                    caseReference: 'ccd123',
                    submitAddress: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY',
                    checkListItems: [
                        {text: 'the original will (by law, we must keep your original will as it becomes a public document)', type: 'textOnly'},
                        {text: 'the original foreign death certificate', type: 'textOnly'},
                        {text: 'the completed inheritance tax form IHT205', type: 'textOnly'},
                        {text: 'copy of the deed poll document for Executor current Name 1', type: 'textOnly'},
                        {text: 'copy of the deed poll document for Executor current Name 3', type: 'textOnly'}
                    ],
                    checkListItemsWelsh: [
                        {text: 'yr ewyllys wreiddiol (yn ôl y gyfraith, rhaid i ni gadw\'r ewyllys wreiddiol wrth iddi ddod yn ddogfen gyhoeddus)', type: 'textOnly'},
                        {text: 'y dystysgrif marwolaeth dramor wreiddiol', type: 'textOnly'},
                        {text: 'y ffurflen treth etifeddiant IHT205 wedi ei llenwi', type: 'textOnly'},
                        {text: 'copi o&rsquo;r ddogfen gweithred newid enw ar gyfer Executor current Name 1', type: 'textOnly'},
                        {text: 'copi o&rsquo;r ddogfen gweithred newid enw ar gyfer Executor current Name 3', type: 'textOnly'}
                    ],
                    noDocumentsRequired: false,
                    noDocumentsRequiredText: null,
                    noDocumentsRequiredTextWelsh: null
                },
                'Post cover sheet pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });

        it('should call super.post() and call with docs required and docs required text if intestacy no docs required conditions met, excepted estate and interim death certificate selected', (done) => {
            const endpoint = 'http://localhost';
            const formdata = {
                caseType: 'intestacy',
                language: {
                    bilingual: 'optionNo'
                },
                applicant: {
                    firstName: 'Joe',
                    lastName: 'Bloggs',
                    address: {
                        formattedAddress: '1 Red Road, London, L1 1LL'
                    },
                    relationshipToDeceased: 'optionSpousePartner',
                },
                deceased: {
                    maritalStatus: 'optionMarried',
                    'dod-date': '2018-01-01',
                    deathCertificate: 'optionInterimCertificate'
                },
                iht: {
                    estateValueCompleted: 'optionNo'
                },
                ccdCase: {
                    id: 'ccd123'
                },
                registry: {
                    address: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY'
                }
            };
            const coverSheetPdf = new CoverSheetPdf(endpoint, 'abc123');
            postStub = sinon.stub(Pdf.prototype, 'post');

            const req = {
                session: {
                    form: formdata,
                    language: 'en'
                }
            };

            coverSheetPdf.post(req);

            expect(postStub.calledOnce).to.equal(true);
            expect(postStub.calledWith(
                config.pdf.template.coverSheet,
                {
                    applicantAddress: '1 Red Road, London, L1 1LL',
                    isBilingual: false,
                    applicantName: 'Joe Bloggs',
                    caseReference: 'ccd123',
                    submitAddress: 'Digital Application, Oxford District Probate Registry, Combined Court Building, St Aldates, Oxford, OX1 1LY',
                    checkListItems: [
                        {text: 'the interim death certificate', type: 'textOnly'}
                    ],
                    checkListItemsWelsh: [
                        {text: 'y dystysgrif marwolaeth dros dro', type: 'textOnly'}
                    ],
                    noDocumentsRequired: false,
                    noDocumentsRequiredText: null,
                    noDocumentsRequiredTextWelsh: null
                },
                'Post cover sheet pdf'
            )).to.equal(true);

            postStub.restore();
            done();
        });
    });
});
