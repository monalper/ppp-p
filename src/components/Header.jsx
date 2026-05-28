import { Link } from 'react-router-dom';
import { Search, Menu } from 'lucide-react';

export default function Header() {
    return (
        <header className="site-header">
            <style>{`
                header.site-header {
                    padding: 40px 0;
                    width: 100%;
                    position: relative;
                    z-index: 50;
                }

                header.site-header.absolute {
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: transparent;
                }

                .header-container {
                    max-width: var(--max-width);
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between; 
                    align-items: center;
                    padding: 0 clamp(1rem, 4vw, 3rem);
                }

                .header-center {
                    display: flex;
                    align-items: center;
                }

                .logo-link {
                    display: inline-block;
                }

                .header-logo-img {
                    height: 30px;
                    display: block;
                }

                .header-right-group {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-lg);
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                }

                .icon-btn {
                    background: none;
                    border: none;
                    color: var(--text-color);
                    cursor: pointer;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    transition: color 0.2s;
                }

                .icon-btn:hover {
                    color: var(--heading-color);
                }

                .header-right {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-lg);
                }

                .header-right a {
                    color: var(--text-color);
                    font-size: 1.1rem;
                    letter-spacing: 0;
                    font-weight: 500;
                    transition: opacity 0.2s;
                }

                .header-right a:hover {
                    opacity: 0.8;
                }
            `}</style>
            <div className="header-container">
                {/* Logo (En Solda - Sade) */}
                <div className="header-center">
                    <Link to="/" className="logo-link">
                        <img src="/header-logo.svg" alt="Aeon Blog" className="header-logo-img" />
                    </Link>
                </div>

                {/* Sağ Grup (İkonlar ve Nav Linkleri) */}
                <div className="header-right-group">
                    <div className="header-left">
                        <button className="icon-btn">
                            <Menu size={22} />
                        </button>
                        <button className="icon-btn">
                            <Search size={22} />
                        </button>
                    </div>

                    <nav className="header-right">
                        <Link to="/">Ana Sayfa</Link>
                        <Link to="/admin">Yönetici</Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}