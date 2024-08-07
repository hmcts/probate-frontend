'use strict';

const LegalDocumentJSONObjectBuilder = require('app/utils/LegalDocumentJSONObjectBuilder');
const {assert} = require('chai');
const fs = require('fs');
const html = fs.readFileSync('test/data/legalDeclationHTML.html').toString();
const requireDir = require('require-directory');
const translations = requireDir(module, '../../../app/resources/en/translation');
const he = require('he');
const FormatName = require('app/utils/FormatName');

let legalDocumentJSONObjectBuilder;
let sessionData;

describe('legalDeclarationPDF', () => {
    beforeEach(() => {
        sessionData = require('test/data/legalDeclarationPDF');
        legalDocumentJSONObjectBuilder = new LegalDocumentJSONObjectBuilder();
    });

    describe('build', () => {
        it('should build the json object from html', (done) => {
            const legalDeclaration = legalDocumentJSONObjectBuilder.build(sessionData, html);
            assert.exists(legalDeclaration);
            //assertPropertyExistsAndIsEqualTo(legalDeclaration.date_created, '');
            assertPropertyExistsAndIsEqualTo(legalDeclaration.deceased, FormatName.format(sessionData.deceased));
            assert.isArray(legalDeclaration.declarations[0].headers, 'Headers exists');
            assert.lengthOf(legalDeclaration.declarations[0].headers, 3, 'Headers array has length of 3');
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].headers[0], translations.declaration.highCourtHeader);
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].headers[1], translations.declaration.familyDivisionHeader);
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].headers[2], translations.declaration.probateHeader);

            assert.isArray(legalDeclaration.declarations[0].sections, 'Sections exists');
            assert.lengthOf(legalDeclaration.declarations[0].sections, 5, 'Headers array has length of 5');
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[0].title, translations.declaration.legalStatementHeader);
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[0].declarationItems[0].title, replaceTokens(translations.declaration.legalStatementApplicant, ['Jason Smith', 'An address somewhere in england postcode']));

            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[1].title, translations.declaration.deceasedHeader);
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[1].declarationItems[0].title, replaceTokens(translations.declaration.legalStatementDeceased, ['Mike Samuels', '20 palmer street rg1 3gx', '1 January 1964', '20 October 2018']));

            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[2].title, translations.declaration.deceasedEstateHeader);
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[2].declarationItems[0].title, replaceTokens(he.decode(translations.declaration.deceasedEstateValue), ['10000', '10000']));
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[2].declarationItems[1].title, replaceTokens(translations.declaration.deceasedEstateLand, ['Mike Samuels', 'Mike Samuels']));

            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[3].title, translations.declaration.executorApplyingHeader);
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[3].declarationItems[0].title, replaceTokens(translations.declaration.applicantName, ['Jason Smith']));
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[3].declarationItems[1].title, replaceTokens(translations.declaration.applicantSend, ['Mike Samuels']));

            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[4].title, translations.declaration.declarationHeader);
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[4].declarationItems[0].title, replaceTokens(translations.declaration.declarationConfirm, ['Mike Samuels']));
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[4].declarationItems[0].values[0], translations.declaration.declarationConfirmItem1);
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[4].declarationItems[0].values[1], translations.declaration.declarationConfirmItem2);
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[4].declarationItems[0].values[2], translations.declaration.declarationConfirmItem3);

            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[4].declarationItems[1].title, translations.declaration.declarationRequests);
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[4].declarationItems[1].values[0], translations.declaration.declarationRequestsItem1);
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[4].declarationItems[1].values[1], translations.declaration.declarationRequestsItem2);

            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[4].declarationItems[2].title, replaceTokens(translations.declaration.declarationUnderstand, ['Jason Smith']));
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[4].declarationItems[2].values[0], translations.declaration.declarationUnderstandItem1);
            assertPropertyExistsAndIsEqualTo(legalDeclaration.declarations[0].sections[4].declarationItems[2].values[1], translations.declaration.declarationUnderstandItem2);

            done();
        });
    });

    const assertPropertyExistsAndIsEqualTo = (value, equalto) => {
        value = value.replace(/\n| /g, '');
        equalto = equalto.replace(/\n| /g, '');
        assert.exists(value);
        assert.equal(value, equalto);
    };

    const replaceTokens = (searchstring, tokenlist) => {
        let result = searchstring;
        for (let i = 0, len = tokenlist.length; i < len; i++) {
            result = result.replace(RegExp('{[a-z0-9]*}', 'i'), tokenlist[i]);
        }
        return result;
    };
});
