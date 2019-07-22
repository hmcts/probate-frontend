'use strict';

const cheerio = require('cheerio');

class CheckAnswersSummaryJSONObjectBuilder {

    build(html) {
        const $ = cheerio.load(html);
        const summary = {};
        summary.sections = [];
        const sections = $('#check-your-answers .heading-large, #check-your-answers .heading-medium, #check-your-answers .heading-small, #check-your-answers .check-your-answers__row');
        const mainParagraph = $('#main-heading-content');
        summary.mainParagraph = mainParagraph.text();
        let section;
        for (const sectElement of Object.entries(sections)) {
            const $element = $(sectElement);
            if ($element.hasClass('heading-large')) {
                summary.pageTitle = $element.text();
            }
            if ($element.hasClass('heading-small')) {
                section = buildSection(section, $element, summary, 'heading-small');
            }
            if ($element.hasClass('heading-medium')) {
                section = buildSection(section, $element, summary, 'heading-medium');
            }
            if ($element.hasClass('check-your-answers__row') && $element.children().length > 0) {
                buildQuestionAndAnswers($element, section);
            }
        }
        return summary;
    }
}

function buildQuestionAndAnswers($element, section) {
    const question = $element.children('.check-your-answers__question');
    const answer = $element.children('.check-your-answers__answer');
    const questionAndAnswer = {};

    questionAndAnswer.question = question.text();
    questionAndAnswer.answers = [];
    const answer_rows = answer.children('.check-your-answers__row');
    if (answer_rows.length > 0) {
        const rows = answer_rows.parent().text()
            .split('\n');
        for (let i = 0; i < rows.length; ++i) {
            if (rows[i].trim().length > 0) {
                questionAndAnswer.answers.push(rows[i].trim());
            }
        }
    } else {
        questionAndAnswer.answers.push(answer.text());
    }
    section.questionAndAnswers.push(questionAndAnswer);
}

function buildSection(section, $element, summary, className) {
    section = {};
    section.title = $element.text();
    section.type = className;
    section.questionAndAnswers = [];
    summary.sections.push(section);
    return section;
}

module.exports = CheckAnswersSummaryJSONObjectBuilder;
