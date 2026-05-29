import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export default function Hero() {
    const [heroData, setHeroData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHero() {
            const { data: settings } = await supabase
                .from('hero_settings')
                .select('post_id, title_position')
                .eq('id', 1)
                .single();

            if (settings && settings.post_id) {
                // Sorguya created_at ve author alanlarını ekledik
                const { data: post } = await supabase
                    .from('posts')
                    .select('title, slug, cover_image, created_at, author')
                    .eq('id', settings.post_id)
                    .single();

                if (post && post.cover_image) {
                    setHeroData({
                        ...post,
                        title_position: settings.title_position || 'center'
                    });
                }
            }
            setLoading(false);
        }
        fetchHero();
    }, []);

    if (loading || !heroData) return null;

    // Tarihi daha okunabilir (GG.AA.YYYY) formatına getirmek için
    const formattedDate = heroData.created_at
        ? new Date(heroData.created_at).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : '-';

    return (
        <Link to={`/stories/${heroData.slug}`} className="home-hero">
            <style>{`
                .home-hero {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    width: 100%;
                    min-height: 520px;
                    border: 4px solid #111212;
                    text-decoration: none;
                    color: #111212;
                    overflow: hidden;
                    margin-bottom: 6rem;
                    transition: opacity 0.3s ease;
                }

                .home-hero:hover {
                    opacity: 1;
                }

                .home-hero-left {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    border-right: 4px solid #111212;
                    padding: 0;
                }

                .home-hero-title-area {
                    padding: clamp(2rem, 4vw, 4rem);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    flex: 1;
                    gap: 1.5rem;
                }

                .home-hero-title {
                    font-family: 'Geist', sans-serif;
                    font-size: clamp(2.5rem, 5vw, 4.5rem);
                    font-weight: 500;
                    line-height: 0.9;
                    letter-spacing: -0.05em;
                    text-transform: lowercase;
                    margin: 0;
                    color: #111212;
                    word-break: break-word;
                    font-feature-settings: 'ss01' on, 'ss02' on;
                }

                .home-hero-meta {
                    display: flex;
                    border-top: 4px solid #111212;
                }

                .home-hero-meta-cell {
                    flex: 1;
                    padding: 1.25rem clamp(1rem, 2vw, 2rem);
                    display: flex;
                    flex-direction: column;
                    gap: 0.35rem;
                    border-right: 4px solid #111212;
                }

                .home-hero-meta-cell:last-child {
                    border-right: none;
                }

                .home-hero-meta-label {
                    font-size: 0.6rem;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    opacity: 0.45;
                    font-family: 'Geist', sans-serif;
                    font-weight: 500;
                }

                .home-hero-meta-value {
                    font-size: 0.85rem;
                    font-family: 'Geist', sans-serif;
                    font-weight: 600;
                    letter-spacing: -0.01em;
                    color: #111212;
                }

                .home-hero-right {
                    position: relative;
                    overflow: hidden;
                    background-color: #111212;
                }

                .home-hero-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    mix-blend-mode: luminosity;
                    opacity: 0.85;
                    transition: mix-blend-mode 0.5s ease, opacity 0.5s ease;
                }

                .home-hero:hover .home-hero-image {
                    mix-blend-mode: normal;
                    opacity: 1;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .home-hero {
                        grid-template-columns: 1fr;
                        min-height: auto;
                    }

                    .home-hero-left {
                        border-right: none;
                        border-bottom: 4px solid #111212;
                    }

                    .home-hero-right {
                        min-height: 300px;
                    }

                    .home-hero-title {
                        font-size: 2.2rem;
                    }

                    .home-hero-meta-cell {
                        padding: 1rem;
                    }
                }
            `}</style>

            <div className="home-hero-left">
                <div className="home-hero-title-area">
                    <h1 className="home-hero-title">{heroData.title}</h1>
                </div>
                <div className="home-hero-meta">
                    <div className="home-hero-meta-cell">
                        <span className="home-hero-meta-label">Yayınlanma Tarihi</span>
                        <span className="home-hero-meta-value">{formattedDate}</span>
                    </div>
                    <div className="home-hero-meta-cell">
                        <span className="home-hero-meta-label">Yazar</span>
                        <span className="home-hero-meta-value">{heroData.author || 'Bilinmiyor'}</span>
                    </div>
                </div>
            </div>

            <div className="home-hero-right">
                <img src={heroData.cover_image} alt={heroData.title} className="home-hero-image" />
            </div>
        </Link>
    );
}