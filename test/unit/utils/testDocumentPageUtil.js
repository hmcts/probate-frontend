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
    describe('getCheckListItemTextWithMultipleLinks()', () => {
        it('should return correctly formatted segments with multiple links', (done) => {
            const content = 'Text before <a href="{link1}">Link1</a> middle <a href="{link2}">Link2</a> after';
            const links = ['http://link1.com', 'http://link2.com'];
            expect(DocumentPageUtil.getCheckListItemTextWithMultipleLinks(content, links)).to.deep.equal({
                type: 'textWithMultipleLinks',
                segments: [
                    {text: 'Text before ', link: null},
                    {text: 'Link1', link: 'http://link1.com'},
                    {text: ' middle ', link: null},
                    {text: 'Link2', link: 'http://link2.com'},
                    {text: ' after', link: null}
                ]
            });
            done();
        });

        it('should handle content with only links', (done) => {
            const content = '<a href="{link1}">Link1</a><a href="{link2}">Link2</a>';
            const links = ['http://link1.com', 'http://link2.com'];
            expect(DocumentPageUtil.getCheckListItemTextWithMultipleLinks(content, links)).to.deep.equal({
                type: 'textWithMultipleLinks',
                segments: [
                    {text: 'Link1', link: 'http://link1.com'},
                    {text: 'Link2', link: 'http://link2.com'}
                ]
            });
            done();
        });

        it('should throw error if links array is empty', (done) => {
            const content = 'Text <a href="{link1}">Link1</a>';
            expect(() => DocumentPageUtil.getCheckListItemTextWithMultipleLinks(content, [])).to.throw('Please pass in a valid array of URLs');
            done();
        });

        it('should throw error if links is not an array', (done) => {
            const content = 'Text <a href="{link1}">Link1</a>';
            expect(() => DocumentPageUtil.getCheckListItemTextWithMultipleLinks(content, null)).to.throw('Please pass in a valid array of URLs');
            done();
        });

        it('should handle content with no links', (done) => {
            const content = 'Text with no links';
            const links = ['http://link1.com'];
            expect(DocumentPageUtil.getCheckListItemTextWithMultipleLinks(content, links)).to.deep.equal({
                type: 'textWithMultipleLinks',
                segments: [
                    {text: 'Text with no links', link: null}
                ]
            });
            done();
        });

        it('should ignore extra links if more links than anchors', (done) => {
            const content = 'Text <a href="{link1}">Link1</a>';
            const links = ['http://link1.com', 'http://extra.com'];
            expect(DocumentPageUtil.getCheckListItemTextWithMultipleLinks(content, links)).to.deep.equal({
                type: 'textWithMultipleLinks',
                segments: [
                    {text: 'Text ', link: null},
                    {text: 'Link1', link: 'http://link1.com'}
                ]
            });
            done();
        });
    });
});
