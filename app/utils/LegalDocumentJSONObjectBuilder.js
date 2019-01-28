'use strict';

const {JSDOM} = require('jsdom');

class LegalDocumentJSONObjectBuilder {

    build(formdata, html) {
        const dom = new JSDOM(html);
        const $ = (require('jquery'))(dom.window);
        const legalDeclaration = {};
        legalDeclaration.headers = [];
        legalDeclaration.sections = [];
        const pageSections = $('.declaration-header, .declaration-subheader, .declaration-item, .list-bullet');

        for (const sectElement of pageSections) {
            const $element = $(sectElement);
            if ($element.hasClass('declaration-header')) {
                legalDeclaration.headers.push($element.html());
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
        if (typeof formdata.deceased !== 'undefined') {
            legalDeclaration.deceased = formdata.deceased.deceasedName;
        } else {
            legalDeclaration.deceased = '';
        }
        return legalDeclaration;
    }
}

function buildDeclarationItemValues($element, legalDeclaration) {
    const section = legalDeclaration.sections[legalDeclaration.sections.length - 1];
    const declarationItem = section.declarationItems.pop();
    declarationItem.values = [];
    const children = $element.children();
    if (children.length > 0) {
        for (const statement of children) {
            declarationItem.values.push(statement.textContent);
        }
    }
    section.declarationItems.push(declarationItem);
}

function buildDeclarationItem($element, legalDeclaration) {
    const declarationItem = {};
    declarationItem.title = $element.html();
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
    section.title = $element.html();
    section.declarationItems = [];
    return section;
}

module.exports = LegalDocumentJSONObjectBuilder;
