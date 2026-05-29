import { useEffect, useState } from 'react';

import { supabase } from '../lib/supabase';

import PostCard from '../components/PostCard';

import Hero from '../components/Hero';

import { CardSkeleton } from '../components/SkeletonLoader';



import './Home.css';



export default function Home() {

    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true);



    useEffect(() => {

        document.title = "ae | essay";

        let isMounted = true;



        async function fetchPosts() {

            const { data, error } = await supabase

                .from('posts')

                .select('*')

                .not('published_at', 'is', null)

                .order('published_at', { ascending: false });



            if (!isMounted) return;



            if (!error && data) {

                setPosts(data);

            }

            setLoading(false);

        }



        fetchPosts();



        return () => {

            isMounted = false;

        };

    }, []);



    return (

        <main className="main-content">

            <Hero />



            {loading ? (

                <section className="post-grid">

                    {[1, 2, 3, 4, 5, 6].map((i) => (

                        <CardSkeleton key={i} />

                    ))}

                </section>

            ) : posts.length > 0 ? (

                <section className="post-grid">

                    {posts.map(post => (

                        <PostCard key={post.id} post={post} />

                    ))}

                </section>

            ) : (

                <div className="no-posts-fallback">

                    <p>Henüz yazı yayınlanmamış. Daha sonra tekrar kontrol edin.</p>

                </div>

            )}

        </main>

    );

}