import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PostCard from '../components/PostCard';
import { estimateReadingTime } from '../lib/postUtils';
import './PostDetail.css';

function TocItem({ item, scrollToHeading, activeId }) {
    const [isOpen, setIsOpen] = useState(false);
    const hasActiveChild = item.children?.some((child) => child.id === activeId);
    const isExpanded = isOpen || hasActiveChild;
    const isActiveH2 = activeId === item.id || hasActiveChild;
    const h2Class = `toc-h2-header ${isActiveH2 ? 'active' : ''}`.trim();

    if (item.level === 'h2' && item.children?.length) {
        return (
            <li className="toc-h2-container">
                <div className={h2Class}>
                    <a href={`#${item.id}`} onClick={(event) => { event.stopPropagation(); scrollToHeading(event, item.id); }}>
                        {item.text}
                    </a>

                    <button
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setIsOpen((open) => !open);
                        }}
                        className="toc-toggle-btn"
                        aria-label="Toggle subsection"
                    >
                        {isExpanded ? '-' : '+'}
                    </button>
                </div>

                {isExpanded && (
                    <ul className="toc-h3-list">
                        {item.children.map((child) => {
                            const isActiveH3 = activeId === child.id;
                            const h3Class = `toc-h3 ${isActiveH3 ? 'active' : ''}`.trim();

                            return (
                                <li key={child.id} className={h3Class}>
                                    <a href={`#${child.id}`} onClick={(event) => scrollToHeading(event, child.id)}>
                                        {child.text}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </li>
        );
    }

    return (
        <li className={`toc-${item.level} ${isActiveH2 ? 'active' : ''}`.trim()}>
            <a href={`#${item.id}`} onClick={(event) => scrollToHeading(event, item.id)}>
                {item.text}
            </a>
        </li>
    );
}

export default function PostDetail({ mode = 'published' }) {
    const { slug } = useParams();

    const tocRef = useRef(null);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toc, setToc] = useState([]);
    const [contentHtml, setContentHtml] = useState('');
    const [activeId, setActiveId] = useState('');
    const [relatedPosts, setRelatedPosts] = useState([]);


    const isDraftView = mode === 'draft';

    function generateToc(htmlContent) {
        const cleanedHtml = htmlContent.replace(/&nbsp;|\u00A0/g, ' ');
        const parser = new DOMParser();
        const doc = parser.parseFromString(cleanedHtml, 'text/html');
        const headingsInfo = [];
        let currentH2 = null;

        doc.querySelectorAll('img[data-source]').forEach((image) => {
            if (image.closest('figure')) {
                return;
            }

            const source = image.getAttribute('data-source');
            const figure = doc.createElement('figure');
            figure.setAttribute('data-type', 'image');
            figure.setAttribute('data-source', source);
            image.replaceWith(figure);
            figure.appendChild(image);

            if (source) {
                const caption = doc.createElement('figcaption');
                caption.setAttribute('data-role', 'image-source');
                caption.textContent = source;
                figure.appendChild(caption);
            }
        });

        doc.querySelectorAll('h2, h3').forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;
            const level = heading.tagName.toLowerCase();
            const item = {
                id,
                text: heading.innerText,
                level,
                children: []
            };

            if (level === 'h2') {
                currentH2 = item;
                headingsInfo.push(currentH2);
            } else if (currentH2) {
                currentH2.children.push(item);
            } else {
                headingsInfo.push(item);
            }
        });

        setToc(headingsInfo);
        setContentHtml(doc.body.innerHTML);
    }

    function scrollToHeading(event, id) {
        event.preventDefault();
        const element = document.getElementById(id);

        if (element) {
            const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const visibleEntries = entries.filter((entry) => entry.isIntersecting);
            if (visibleEntries.length > 0) {
                setActiveId(visibleEntries[0].target.id);
            }
        }, {
            rootMargin: '0px 0px -60% 0px',
            threshold: 0
        });

        const timeoutId = window.setTimeout(() => {
            const headings = document.querySelectorAll('.article-content h2, .article-content h3');
            headings.forEach((heading) => observer.observe(heading));
        }, 100);

        return () => {
            window.clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, [contentHtml]);



    useEffect(() => {
        let isMounted = true;

        async function fetchPost() {
            setLoading(true);
            setPost(null);
            setToc([]);
            setContentHtml('');
            setRelatedPosts([]);
            setActiveId('');

            let query = supabase
                .from('posts')
                .select('*')
                .eq('slug', slug);

            query = isDraftView
                ? query.is('published_at', null)
                : query.not('published_at', 'is', null);

            const { data, error } = await query.single();

            if (!isMounted) {
                return;
            }

            if (error || !data) {
                setPost(null);
                setLoading(false);
                return;
            }

            setPost(data);
            document.title = isDraftView ? `${data.title} | Draft` : data.title;
            generateToc(data.content || '');

            let relatedQuery = supabase
                .from('posts')
                .select('*')
                .neq('id', data.id);

            relatedQuery = isDraftView
                ? relatedQuery.is('published_at', null)
                : relatedQuery.not('published_at', 'is', null);

            const { data: related } = await relatedQuery;

            if (!isMounted) {
                return;
            }

            if (related?.length) {
                const shuffled = [...related].sort(() => 0.5 - Math.random());
                setRelatedPosts(shuffled.slice(0, 2));
            } else {
                setRelatedPosts([]);
            }

            setLoading(false);
        }

        fetchPost();

        return () => {
            isMounted = false;
            document.title = 'The Augland';
        };
    }, [isDraftView, slug]);

    if (loading) {
        return <main className="main-content">Deneme yükleniyor..</main>;
    }

    if (!post) {
        return <main className="main-content">Deneme bulunamadı.</main>;
    }

    const displayDate = new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    const readingTime = estimateReadingTime(post.content);
    const articleMeta = `${displayDate} | ${readingTime} dk okuma`;

    return (
        <main className="main-content">
            <header className="article-page-header">
                <span className="article-page-meta-mobile">{articleMeta}</span>
            </header>

            <div className="article-page-layout">
                <aside
                    ref={tocRef}
                    className="article-toc"
                >
                    <div className="toc-sticky">
                        <h1 className="toc-sticky-title">{post.title}</h1>
                        <header className="toc-header">
                            <div className="article-date toc-article-date">{articleMeta}</div>
                        </header>

                        {toc.length > 0 && (
                            <ul>
                                {toc.map((item) => (
                                    <TocItem
                                        key={item.id}
                                        item={item}
                                        scrollToHeading={scrollToHeading}
                                        activeId={activeId}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                </aside>

                <article className="article-layout">
                    {post.cover_image && (
                        <div className="article-cover-section">
                            <div className="article-cover-wrapper">
                                <img src={post.cover_image} alt={post.title} className="article-cover-img" />
                            </div>

                            {post.cover_image_source && (
                                <div className="article-cover-source">
                                    {post.cover_image_source}
                                </div>
                            )}
                        </div>
                    )}

                    <div
                        className="article-content"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />

                    {relatedPosts.length > 0 && (
                        <div className="related-posts-section">
                            <h3 className="related-posts-title">Daha Fazlası</h3>
                            <div className="related-posts-grid">
                                {relatedPosts.map((relatedPost) => (
                                    <PostCard key={relatedPost.id} post={relatedPost} />
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </div>
        </main>
    );
}
