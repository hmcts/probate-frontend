'use strict';

const {JSDOM} = require('jsdom');

class CheckAnswersSummaryJSONObjectBuilder {

    build(html) {
        const dom = new JSDOM(html);
        const $ = (require('jquery'))(dom.window);
        const summary = {};
        summary.sections = [];
        const sections = $('#check-your-answers .heading-large, #check-your-answers .heading-medium, #check-your-answers .heading-small, #check-your-answers .check-your-answers__row');
        const mainParagraph = $('#main-heading-content');
        summary.mainParagraph = mainParagraph.text();
        let section;
        for (const sectElement of sections) {
            const $element = $(sectElement);
            if ($element.hasClass('heading-large')) {
                summary.pageTitle = $element.text();
            }
            if ($element.hasClass('heading-medium') || $element.hasClass('heading-small')) {
                section = buildSection(section, $element, summary);
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
    const children = answer.children('.check-your-answers__row');
    if (children.length > 0) {
        for (const answerChild of children) {
            questionAndAnswer.answers.push(answerChild.textContent);
        }
    } else {
        questionAndAnswer.answers.push(answer.text());
    }
    section.questionAndAnswers.push(questionAndAnswer);
}

function buildSection(section, $element, summary) {
    section = {};
    section.title = $element.text();
    section.type = $element.attr('class');
    section.questionAndAnswers = [];
    summary.sections.push(section);
    return section;
}

module.exports = CheckAnswersSummaryJSONObjectBuilder;
