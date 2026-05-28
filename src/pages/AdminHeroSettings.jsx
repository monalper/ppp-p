import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Admin.css';

export default function AdminHeroSettings() {
    const [posts, setPosts] = useState([]);
    const [settings, setSettings] = useState({ post_id: '', title_position: 'center' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchData() {
            // Fetch all posts to choose from
            const { data: postsData } = await supabase
                .from('posts')
                .select('id, title, published_at')
                .order('created_at', { ascending: false });

            if (postsData) {
                setPosts(postsData.filter(post => post.published_at !== null));
            }

            // Fetch current settings
            const { data: heroData } = await supabase
                .from('hero_settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (heroData) {
                setSettings({
                    post_id: heroData.post_id || '',
                    title_position: heroData.title_position || 'center'
                });
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        const { error } = await supabase
            .from('hero_settings')
            .upsert({
                id: 1,
                post_id: settings.post_id || null,
                title_position: settings.title_position
            });

        if (error) {
            setMessage('Hata: ' + error.message);
        } else {
            setMessage('Başarıyla kaydedildi!');
            setTimeout(() => setMessage(''), 3000);
        }
        setSaving(false);
    };

    if (loading) return <div className="admin-container main-content">Yükleniyor...</div>;

    const positions = [
        { value: 'top-left', label: 'Sol Üst' },
        { value: 'top-center', label: 'Orta Üst' },
        { value: 'top-right', label: 'Sağ Üst' },
        { value: 'center-left', label: 'Sol Orta' },
        { value: 'center', label: 'Tam Orta' },
        { value: 'center-right', label: 'Sağ Orta' },
        { value: 'bottom-left', label: 'Sol Alt' },
        { value: 'bottom-center', label: 'Orta Alt' },
        { value: 'bottom-right', label: 'Sağ Alt' },
    ];

    return (
        <main className="main-content admin-container">
            <header className="admin-dashboard-header">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link to="/admin" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
                        <ArrowLeft size={18} />
                    </Link>
                    <h1>Hero (Vitrin) Ayarları</h1>
                </div>
            </header>

            <form onSubmit={handleSave} className="admin-login-box" style={{ maxWidth: '600px', margin: '0' }}>
                {message && (
                    <div className="error-message" style={{ backgroundColor: message.includes('Hata') ? 'rgb(239 68 68 / 14%)' : 'rgb(52 211 153 / 14%)', color: message.includes('Hata') ? '#ffb0b0' : '#88f3c7' }}>
                        {message}
                    </div>
                )}

                <div className="input-group">
                    <label>Vitrin Yazısı (Hero Post)</label>
                    <select
                        className="input-field"
                        value={settings.post_id}
                        onChange={(e) => setSettings({ ...settings, post_id: e.target.value })}
                    >
                        <option value="">Hiçbiri (Hero Gizle)</option>
                        {posts.map(post => (
                            <option key={post.id} value={post.id}>
                                {post.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input-group">
                    <label>Başlık Konumu</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {positions.map(pos => (
                            <button
                                key={pos.value}
                                type="button"
                                className={`btn ${settings.title_position === pos.value ? '' : 'btn-secondary'}`}
                                onClick={() => setSettings({ ...settings, title_position: pos.value })}
                                style={{ padding: '0.5rem', fontSize: '0.9rem', justifyContent: 'center' }}
                            >
                                {pos.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button type="submit" className="btn" disabled={saving}>
                        <Save size={18} />
                        <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                    </button>
                </div>
            </form>
        </main>
    );
}
