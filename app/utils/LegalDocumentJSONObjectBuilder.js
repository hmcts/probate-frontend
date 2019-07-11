'use strict';

const cheerio = require('cheerio');
const FormatName = require('app/utils/FormatName');

class LegalDocumentJSONObjectBuilder {

    build(formdata, html) {
        const $ = cheerio.load(html);
        const legalDeclaration = {};
        legalDeclaration.headers = [];
        legalDeclaration.sections = [];
        const pageSections = $('.declaration-header, .declaration-subheader, .declaration-item, .list-bullet');

        for (const sectElement of Object.entries(pageSections)) {
            const $element = $(sectElement);
            if ($element.hasClass('declaration-header')) {
                legalDeclaration.headers.push($element.text());
            } else if ($element.hasClass('declaration-subheader')) {
                const section = buildSection($element);
                legalDeclaration.sections.push(section);
            } else if ($element.hasClass('declaration-item')) {
                buildDeclarationItem($element, legalDeclaration);
            } else if ($element.hasClass('list-bullet')) {
                buildDeclarationItemValues($element, legalDeclaration);
            }
        }
        legalDeclaration.dateCreated = new Date().toLocaleString();
        legalDeclaration.deceased = FormatName.format(formdata.deceased);

        return legalDeclaration;
    }
}

function buildDeclarationItemValues($element, legalDeclaration) {
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
}

function buildDeclarationItem($element, legalDeclaration) {
    const declarationItem = {};
    declarationItem.title = $element.text();
    const section = legalDeclaration.sections[legalDeclaration.sections.length - 1];
    section.declarationItems.push(declarationItem);
}

function buildSection($element) {
    const section = {};
    if ($element.hasClass('heading-medium') || $element.hasClass('heading-large')) {
        section.headingType = 'large';
    } else {
        section.headingType = 'small';
    }
    section.title = $element.text();
    section.declarationItems = [];
    return section;
}

module.exports = LegalDocumentJSONObjectBuilder;
