import { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
    useLocation
} from 'react-router-dom';
import { supabase } from './lib/supabase';
import Footer from './components/Footer';
import Header from './components/Header';
import AdminAddEdit from './pages/AdminAddEdit';
import AdminDashboard from './pages/AdminDashboard';
import AdminHeroSettings from './pages/AdminHeroSettings';
import AdminLogin from './pages/AdminLogin';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';

function ProtectedRoute({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div className="main-content">YÃ¼kleniyor...</div>;
    }

    if (!session) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}

function AppShell() {
    const location = useLocation();
    const isAdminEditorRoute = /^\/admin\/(add|edit\/[^/]+)$/.test(location.pathname);

    return (
        <div className={`app-container ${isAdminEditorRoute ? 'app-container--editor' : ''}`.trim()}>
            {!isAdminEditorRoute ? (
                <div className="page-content-wrapper">
                    <Header />

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/stories/:slug" element={<PostDetail mode="published" />} />
                        <Route path="/draft/:slug" element={<PostDetail mode="draft" />} />

                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route
                            path="/admin"
                            element={(
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            )}
                        />
                        <Route
                            path="/admin/hero"
                            element={(
                                <ProtectedRoute>
                                    <AdminHeroSettings />
                                </ProtectedRoute>
                            )}
                        />
                        <Route
                            path="/admin/add"
                            element={(
                                <ProtectedRoute>
                                    <AdminAddEdit />
                                </ProtectedRoute>
                            )}
                        />
                        <Route
                            path="/admin/edit/:id"
                            element={(
                                <ProtectedRoute>
                                    <AdminAddEdit />
                                </ProtectedRoute>
                            )}
                        />
                    </Routes>
                </div>
            ) : (
                <>
                    <Routes>
                        <Route path="/admin/add" element={(<ProtectedRoute><AdminAddEdit /></ProtectedRoute>)} />
                        <Route path="/admin/edit/:id" element={(<ProtectedRoute><AdminAddEdit /></ProtectedRoute>)} />
                    </Routes>
                </>
            )}

            {!isAdminEditorRoute && <Footer />}
        </div>
    );
}

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

function App() {
    return (
        <Router>
            <ScrollToTop />
            <AppShell />
        </Router>
    );
}

export default App;
