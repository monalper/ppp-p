import './SkeletonLoader.css';

export function CardSkeleton() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-img"></div>
            <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-line" style={{ width: '90%' }}></div>
                <div className="skeleton-line" style={{ width: '80%' }}></div>
                <div className="skeleton-line" style={{ width: '60%' }}></div>
            </div>
        </div>
    );
}

export function PostDetailSkeleton() {
    return (
        <main className="main-content">
            <div className="article-page-layout">
                <aside className="article-toc skeleton-toc">
                    <div className="skeleton-title" style={{ height: '3rem', width: '80%', marginBottom: '1rem' }}></div>
                    <div className="skeleton-line" style={{ width: '100%', marginBottom: '2rem' }}></div>
                    <div className="skeleton-line" style={{ width: '60%' }}></div>
                    <div className="skeleton-line" style={{ width: '50%' }}></div>
                    <div className="skeleton-line" style={{ width: '70%' }}></div>
                    <div className="skeleton-line" style={{ width: '40%' }}></div>
                </aside>

                <article className="article-layout skeleton-article">
                    <div className="skeleton-img" style={{ aspectRatio: '16/8.8', marginBottom: '2rem', borderRadius: '16px' }}></div>
                    <div className="skeleton-line" style={{ width: '100%', height: '1.25rem', marginBottom: '1rem' }}></div>
                    <div className="skeleton-line" style={{ width: '95%', height: '1.25rem', marginBottom: '1rem' }}></div>
                    <div className="skeleton-line" style={{ width: '90%', height: '1.25rem', marginBottom: '1rem' }}></div>
                    <div className="skeleton-line" style={{ width: '85%', height: '1.25rem', marginBottom: '2rem' }}></div>

                    <div className="skeleton-title" style={{ width: '50%', marginBottom: '1rem' }}></div>
                    <div className="skeleton-line" style={{ width: '100%', height: '1.25rem', marginBottom: '1rem' }}></div>
                    <div className="skeleton-line" style={{ width: '90%', height: '1.25rem', marginBottom: '1rem' }}></div>
                    <div className="skeleton-line" style={{ width: '80%', height: '1.25rem', marginBottom: '1rem' }}></div>
                </article>
            </div>
        </main>
    );
}
