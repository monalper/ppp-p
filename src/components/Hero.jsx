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
                const { data: post } = await supabase
                    .from('posts')
                    .select('title, slug, cover_image')
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

    const positionClass = `hero-pos-${heroData.title_position}`;

    return (
        <Link to={`/blog/${heroData.slug}`} className={`home-hero ${positionClass}`}>
            <style>{`
                .home-hero {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 16 / 9;
                    min-height: 420px;
                    max-height: 650px;
                    border-radius: 24px;
                    overflow: hidden;
                    margin-bottom: var(--spacing-xl);
                    display: flex;
                    text-decoration: none; /* Link alt çizgisini kaldırmak için */
                }

                .hero-bg {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    z-index: 1;
                    
                }

                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    z-index: 2;
                    pointer-events: none;
                }

                .hero-content {
                    position: relative;
                    z-index: 3;
                    width: 100%;
                    padding: clamp(2rem, 4vw, 4rem);
                    display: flex;
                    flex-direction: column;
                    max-width: 850px;
                    height: 100%;
                    box-sizing: border-box;
                }

                /* Konuma Göre Lokal Arka Plan Gradyanları */
                .hero-pos-top-left, .hero-pos-center-left, .hero-pos-bottom-left {
                    background: linear-gradient(to right, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0) 100%);
                }
                .hero-pos-top-left .hero-content { justify-content: flex-start; align-items: flex-start; text-align: left; margin-right: auto; }
                .hero-pos-center-left .hero-content { justify-content: center; align-items: flex-start; text-align: left; margin-right: auto; }
                .hero-pos-bottom-left .hero-content { justify-content: flex-end; align-items: flex-start; text-align: left; margin-right: auto; }
                
                .hero-pos-top-center, .hero-pos-center, .hero-pos-bottom-center {
                    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.75) 100%);
                }
                .hero-pos-top-center .hero-content { justify-content: flex-start; align-items: center; text-align: center; margin: 0 auto; }
                .hero-pos-center .hero-content { justify-content: center; align-items: center; text-align: center; margin: 0 auto; }
                .hero-pos-bottom-center .hero-content { justify-content: flex-end; align-items: center; text-align: center; margin: 0 auto; }
                
                .hero-pos-top-right, .hero-pos-center-right, .hero-pos-bottom-right {
                    background: linear-gradient(to left, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0) 100%);
                }
                .hero-pos-top-right .hero-content { justify-content: flex-start; align-items: flex-end; text-align: right; margin-left: auto; }
                .hero-pos-center-right .hero-content { justify-content: center; align-items: flex-end; text-align: right; margin-left: auto; }
                .hero-pos-bottom-right .hero-content { justify-content: flex-end; align-items: flex-end; text-align: right; margin-left: auto; }

                /* Bold Başlık Ayarı */
                .hero-title {
                    font-size: clamp(1.6rem, 3.2vw, 2.6rem);
                    color: #ffffff;
                    font-family: var(--font-heading), Georgia, serif;
                    font-weight: 700;
                    line-height: 1.25;
                    text-wrap: balance;
                    margin: 0;
                    letter-spacing: -0.01em;
                }
            `}</style>
            <img src={heroData.cover_image} alt={heroData.title} className="hero-bg" />
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <h1 className="hero-title">{heroData.title}</h1>
            </div>
        </Link>
    );
}