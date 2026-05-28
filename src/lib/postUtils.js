export function slugifyTitle(value = '') {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

export function isDraftPost(post) {
    return !post?.published_at;
}

export function getPostPath(post) {
    if (!post?.slug) {
        return '/';
    }

    return `${isDraftPost(post) ? '/draft' : '/blog'}/${post.slug}`;
}

export function extractPlainText(html = '') {
    if (typeof window === 'undefined') {
        return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    return (doc.body.textContent || '')
        .replace(/\s+/g, ' ')
        .trim();
}

export function buildSummary(html = '', fallback = '') {
    const plainText = extractPlainText(html);
    const summarySource = plainText || fallback.trim();

    if (!summarySource) {
        return '';
    }

    return summarySource.slice(0, 180).trim();
}

export function estimateReadingTime(html = '') {
    const plainText = extractPlainText(html);
    const words = plainText.split(/\s+/).filter(Boolean).length;

    return Math.max(1, Math.ceil(words / 225));
}
