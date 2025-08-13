'use strict';

const expect = require('chai').expect;
const DocumentPageUtil = require('app/utils/DocumentPageUtil');

describe('DocumentPageUtil.js', () => {
    describe('getCheckListItemTextOnly()', () => {
        it('should return correctly formatted text only checkListItem', (done) => {
            const textOnlyContent = 'Some text with no links';
            expect(DocumentPageUtil.getCheckListItemTextOnly(textOnlyContent)).to.deep.equal({text: 'Some text with no links', type: 'textOnly'});
            done();
        });
    });
    describe('getCheckListItemTextWithLink()', () => {
        it('should return correctly formatted text with link checkListItem', (done) => {
            const textWithLinkContent = 'Some text BEFORE the link <a href="{someLinkPlaceholder}" target="_blank">Text in the link</a> Some text AFTER the link';
            const link = 'http://example-link.com';
            expect(DocumentPageUtil.getCheckListItemTextWithLink(textWithLinkContent, link)).to.deep.equal(
                {
                    text: 'Text in the link',
                    type: 'textWithLink',
                    url: link,
                    beforeLinkText: 'Some text BEFORE the link ',
                    afterLinkText: ' Some text AFTER the link'
                });
            done();
        });

        it('should return correctly formatted text with link checkListItem with no before link text', (done) => {
            const textWithLinkContent = '<a href="{someLinkPlaceholder}" target="_blank">Text in the link</a> Some text AFTER the link';
            const link = 'http://example-link.com';
            expect(DocumentPageUtil.getCheckListItemTextWithLink(textWithLinkContent, link)).to.deep.equal(
                {
                    text: 'Text in the link',
                    type: 'textWithLink',
                    url: link,
                    beforeLinkText: '',
                    afterLinkText: ' Some text AFTER the link'
                });
            done();
        });

        it('should return correctly formatted text with link checkListItem with no after link text', (done) => {
            const textWithLinkContent = 'Some text BEFORE the link <a href="{someLinkPlaceholder}" target="_blank">Text in the link</a>';
            const link = 'http://example-link.com';
            expect(DocumentPageUtil.getCheckListItemTextWithLink(textWithLinkContent, link)).to.deep.equal(
                {
                    text: 'Text in the link',
                    type: 'textWithLink',
                    url: link,
                    beforeLinkText: 'Some text BEFORE the link ',
                    afterLinkText: ''
                });
            done();
        });

        it('should return an error if no link is passed in as argument', (done) => {
            const text = 'Some text BEFORE the link <a href="{someLinkPlaceholder}" target="_blank">Text in the link</a>';
            const link = null;
            expect(DocumentPageUtil.getCheckListItemTextWithLink.bind(DocumentPageUtil, text, link)).to.throw('please pass in a valid url');
            done();
        });

        it('should return an error if no href in the content', (done) => {
            const textWithNoLink = 'Some text with no link';
            const link = 'http://example-link.com';
            expect(DocumentPageUtil.getCheckListItemTextWithLink.bind(DocumentPageUtil, textWithNoLink, link)).to.throw('there is no link in content item: "Some text with no link"');
            done();
        });
    });
    describe('getCheckListItemTextWithLinks()', () => {
        it('should return concatenated link texts for multiple links', (done) => {
            const content = 'Text before <a href="{link1}">First Link</a> middle <a href="{link2}">Second Link</a> after';
            const links = ['http://first.com', 'http://second.com'];
            const expected = 'First LinkSecond Link';
            expect(DocumentPageUtil.getCheckListItemTextWithLinks(content, links)).to.equal(expected);
            done();
        });

        it('should handle single link', (done) => {
            const content = 'Start <a href="{link1}">Only Link</a> End';
            const links = ['http://only.com'];
            expect(DocumentPageUtil.getCheckListItemTextWithLinks(content, links)).to.equal('Only Link');
            done();
        });

        it('should throw error if links array is empty', (done) => {
            const content = 'Text <a href="{link1}">Link</a> more text';
            expect(() => DocumentPageUtil.getCheckListItemTextWithLinks(content, [])).to.throw('please pass at least one valid url');
            done();
        });

        it('should throw error if not enough links for anchors', (done) => {
            const content = 'Text <a href="{link1}">Link1</a> <a href="{link2}">Link2</a>';
            const links = ['http://onlyone.com'];
            expect(() => DocumentPageUtil.getCheckListItemTextWithLinks(content, links)).to.throw('Not enough links provided for the number of anchors in content');
            done();
        });

        it('should throw error if no anchor tags in content', (done) => {
            const content = 'No links here';
            const links = ['http://something.com'];
            expect(() => DocumentPageUtil.getCheckListItemTextWithLinks(content, links)).to.throw('there is no link in content item: "No links here"');
            done();
        });
    });
});
