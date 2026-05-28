import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, Eye, LogOut, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getPostPath, isDraftPost } from '../lib/postUtils';
import './Admin.css';

export default function AdminDashboard() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        async function fetchPosts() {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (!isMounted) {
                return;
            }

            if (!error && data) {
                const sortedPosts = [...data].sort((left, right) => {
                    const leftDate = new Date(left.published_at || left.created_at || 0).getTime();
                    const rightDate = new Date(right.published_at || right.created_at || 0).getTime();

                    return rightDate - leftDate;
                });

                setPosts(sortedPosts);
            }

            setLoading(false);
        }

        fetchPosts();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this essay?')) {
            await supabase.from('posts').delete().eq('id', id);
            setPosts(posts.filter((post) => post.id !== id));
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    return (
        <main className="main-content admin-container">
            <header className="admin-dashboard-header">
                <h1>Yönetim Paneli</h1>

                <div className="admin-actions">
                    <Link to="/admin/hero" className="btn btn-secondary">
                        <Eye size={18} />
                        <span>Vitrin Ayarları</span>
                    </Link>

                    <Link to="/admin/add" className="btn">
                        <Plus size={18} />
                        <span>Yeni Deneme</span>
                    </Link>

                    <button onClick={handleLogout} className="btn btn-secondary">
                        <LogOut size={18} />
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            </header>

            {loading ? (
                <p>Deneme yükleniyor...</p>
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Başlık</th>
                                <th>Tarih</th>
                                <th>Aksiyonlar</th>
                            </tr>
                        </thead>

                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id}>
                                    <td>
                                        <div className="post-title-cell">
                                            <span>{post.title}</span>
                                            <span className={`status-badge ${isDraftPost(post) ? 'is-draft' : 'is-published'}`}>
                                                {isDraftPost(post) ? 'Draft' : 'Published'}
                                            </span>
                                        </div>
                                    </td>

                                    <td>{new Date(post.published_at || post.created_at).toLocaleDateString()}</td>

                                    <td className="table-actions">
                                        <Link to={getPostPath(post)} className="action-btn">
                                            <Eye size={16} />
                                            <span>Önizleme</span>
                                        </Link>

                                        <Link to={`/admin/edit/${post.id}`} className="action-btn">
                                            <Edit2 size={16} />
                                            <span>Düzenle</span>
                                        </Link>

                                        <button onClick={() => handleDelete(post.id)} className="action-btn text-danger">
                                            <Trash2 size={16} />
                                            <span>Sil</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {posts.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="empty-state">
                                        Herhangi bir deneme yok.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}
