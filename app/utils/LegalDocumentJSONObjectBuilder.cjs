'use strict';

const forEach = require('lodash').forEach;
const cheerio = require('cheerio');
const FormatName = require('app/utils/FormatName.cjs');

class LegalDocumentJSONObjectBuilder {

    build(formdata, html) {
        const $ = cheerio.load(html);
        const legalDeclaration = {
            declarations: []
        };
        const languages = $('.declaration-language');

        forEach(languages, langElement => {
            const $langElement = $(langElement);
            const language = $langElement.hasClass('language-cy') ? 'cy' : 'en';
            const pageSections = $(`.language-${language} .declaration-header-item, .language-${language} .declaration-subheader, .language-${language} .declaration-item, .language-${language} .govuk-list--bullet`);

            const declaration = {
                headers: [],
                sections: []
            };

            for (const sectElement of Object.entries(pageSections)) {
                const $sectElement = $(sectElement);
                if ($sectElement.hasClass('declaration-header-item')) {
                    declaration.headers.push($sectElement.text());
                } else if ($sectElement.hasClass('declaration-subheader')) {
                    const section = buildSection($sectElement);
                    declaration.sections.push(section);
                } else if ($sectElement.hasClass('declaration-item')) {
                    buildDeclarationItem($sectElement, declaration);
                } else if ($sectElement.hasClass('govuk-list--bullet')) {
                    buildDeclarationItemValues($sectElement, declaration);
                }
            }

            legalDeclaration.declarations.push(declaration);
        });

        legalDeclaration.dateCreated = new Date().toLocaleString();
        legalDeclaration.deceased = FormatName.format(formdata.deceased);

        return legalDeclaration;
    }
}

const buildDeclarationItemValues = ($element, legalDeclaration) => {
    const section = legalDeclaration.sections[legalDeclaration.sections.length - 1];
    const declarationItem = section.declarationItems.pop();
    declarationItem.values = [];
    const children = $element.children();
    if (children.length > 0) {
        const rows = children.parent().text()
            .split('\n');
        for (let i = 0; i < rows.length; ++i) {
            if (rows[i].trim().length > 0) {
                declarationItem.values.push(rows[i].trim());
            }
        }
    }
    section.declarationItems.push(declarationItem);
};

const buildDeclarationItem = ($element, legalDeclaration) => {
    const declarationItem = {};
    declarationItem.title = $element.text();
    const section = legalDeclaration.sections[legalDeclaration.sections.length - 1];
    section.declarationItems.push(declarationItem);
};

const buildSection = ($element) => {
    const section = {};
    if ($element.hasClass('govuk-heading-m') || $element.hasClass('govuk-heading-l')) {
        section.headingType = 'large';
    } else {
        section.headingType = 'small';
    }
    section.title = $element.text();
    section.declarationItems = [];
    return section;
};

module.exports = LegalDocumentJSONObjectBuilder;
