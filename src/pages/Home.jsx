import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import PostCard from '../components/PostCard';
import NasaApod from '../components/NasaApod';
import Hero from '../components/Hero';

import './Home.css';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "The Augland";

        async function fetchPosts() {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .not('published_at', 'is', null)
                .order('published_at', { ascending: false });

            if (!error && data) {
                setPosts(data);
            }
            setLoading(false);
        }
        fetchPosts();
    }, []);

    return (
        <main className="main-content">
            <Hero />
            {loading ? (
                <p>Denemeler yükleniyor...</p>
            ) : (
                <>
                    {posts.length > 0 ? (
                        <>
                            <section className="post-grid">
                                {posts.slice(0, 6).map(post => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </section>

                            <NasaApod />

                            {posts.length > 6 && (
                                <section className="post-grid" style={{ marginTop: 'var(--spacing-xl)' }}>
                                    {posts.slice(6).map(post => (
                                        <PostCard key={post.id} post={post} />
                                    ))}
                                </section>
                            )}
                        </>
                    ) : (
                        <>
                            <p>Henüz yazı yayınlanmamış. Daha sonra tekrar kontrol edin.</p>
                            <NasaApod />
                        </>
                    )}
                </>
            )}
        </main>
    );
}
