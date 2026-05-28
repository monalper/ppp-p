import Image from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';

function getImageElement(element) {
    if (!element) {
        return null;
    }

    return element.tagName?.toLowerCase() === 'img'
        ? element
        : element.querySelector('img');
}

function getImageSource(element) {
    if (!element) {
        return '';
    }

    return element.getAttribute('data-source')
        || element.querySelector('[data-role="image-source"]')?.textContent
        || '';
}

const SourceImage = Image.extend({
    addAttributes() {
        return {
            src: {
                default: null,
                parseHTML: (element) => getImageElement(element)?.getAttribute('src'),
            },
            alt: {
                default: null,
                parseHTML: (element) => getImageElement(element)?.getAttribute('alt'),
            },
            title: {
                default: null,
                parseHTML: (element) => getImageElement(element)?.getAttribute('title'),
            },
            source: {
                default: '',
                parseHTML: (element) => getImageSource(element),
                renderHTML: () => ({}),
            },
        };
    },

    parseHTML() {
        return [
            { tag: 'figure[data-type="image"]' },
            { tag: 'img[src]' },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        const {
            src,
            alt,
            title,
            source,
            ...rest
        } = HTMLAttributes;

        const figureAttributes = { 'data-type': 'image' };

        if (source) {
            figureAttributes['data-source'] = source;
        }

        const imageNode = ['img', mergeAttributes(rest, { src, alt, title })];

        if (!source) {
            return ['figure', figureAttributes, imageNode];
        }

        return [
            'figure',
            figureAttributes,
            imageNode,
            ['figcaption', { 'data-role': 'image-source' }, source],
        ];
    },
});

export default SourceImage;
