import { Link, useLocation } from 'react-router-dom';
import { Search, Menu } from 'lucide-react';

export default function Header() {
    const location = useLocation();
    const isAbsolute = location.pathname.startsWith('/stories/') || location.pathname.startsWith('/draft/');

    return (
        <header className={`site-header ${isAbsolute ? 'site-header--overlay' : ''}`}>
            <style>{`
                header.site-header {
                    width: 100%;
                    position: relative;
                    z-index: 50;
                    background-color: #EFEEEC; 
                    color: #111212;
                    font-family: 'Geist', sans-serif;
                }

                /* Makale detay sayfalarında (Overlay modunda) tüm borderlar kalkar */
                header.site-header.site-header--overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: transparent;
                    mix-blend-mode: difference;
                    color: #fff;
                }

                .header-container {
                    max-width: 100%;
                    margin: 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: stretch;
                }

                /* Detay sayfasındaki ag-title-container padding'i ile kusursuz sol dikey hizalama */
                .header-left {
                    padding: 2rem clamp(1.5rem, 5vw, 4rem);
                    display: flex;
                    align-items: center;
                }

                .logo-link {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    text-decoration: none;
                    color: inherit;
                }

                .header-logo-img {
                    height: 42px;
                    display: block;
                    transition: filter 0.2s ease;
                }

                /* LOGO DETAY SAYFASI ÇÖZÜMÜ: 
                   Mix-blend-mode'un logoyu yok etmesini engellemek için rengini beyaz yapıyoruz */
                .site-header--overlay .header-logo-img {
                    filter: brightness(0) invert(1);
                }

                .logo-text {
                    font-size: 1.15rem; 
                    font-weight: 600;
                    letter-spacing: -0.04em;
                    text-transform: lowercase;
                    color: inherit;
                    line-height: 1;
                }

                .header-right-group {
                    display: flex;
                    align-items: center;
                    flex-grow: 1;
                    justify-content: flex-end;
                }

                .header-nav {
                    display: flex;
                    align-items: center;
                    height: 100%;
                }

                .header-nav-link {
                    color: inherit;
                    font-size: 1.15rem; 
                    text-transform: lowercase;
                    font-weight: 500;
                    letter-spacing: -0.03em;
                    text-decoration: none;
                    padding: 2rem 2rem;
                    display: flex;
                    align-items: center;
                    height: 100%;
                    transition: all 0.2s ease;
                }

                .header-nav-link:hover {
                    background-color: #111212;
                    color: #EFEEEC;
                }

                .site-header--overlay .header-nav-link:hover {
                    background-color: #ffffff;
                    color: #111212;
                }

                .header-tools {
                    display: flex;
                    align-items: center;
                    height: 100%;
                }

                .icon-btn {
                    background: none;
                    border: none;
                    outline: none;
                    color: inherit;
                    cursor: pointer;
                    padding: 2rem 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    transition: all 0.2s ease;
                }

                .icon-btn:hover {
                    background-color: #111212;
                    color: #EFEEEC;
                }

                .site-header--overlay .icon-btn:hover {
                    background-color: #ffffff;
                    color: #111212;
                }

                @media (max-width: 768px) {
                    .header-left {
                        padding: 1.5rem;
                    }
                    .header-nav {
                        display: none;
                    }
                    .icon-btn {
                        padding: 1.5rem;
                    }
                }
            `}</style>

            <div className="header-container">
                <div className="header-left">
                    <Link to="/" className="logo-link">
                        <img src="/header-logo.svg" alt="Aeon" className="header-logo-img" />
                        <span className="logo-text">essay</span>
                    </Link>
                </div>

                <div className="header-right-group">
                    <nav className="header-nav">
                        <Link to="/" className="header-nav-link">indeks</Link>
                        <Link to="/admin" className="header-nav-link">küratör</Link>
                    </nav>

                    <div className="header-tools">
                        <button className="icon-btn" aria-label="Search">
                            <Search size={22} strokeWidth={1.5} />
                        </button>
                        <button className="icon-btn" aria-label="Menu">
                            <Menu size={22} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}