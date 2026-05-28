import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// WMO Hava Durumu Kodu Türkçe Açıklamaları
const weatherDescriptions = {
    0: 'Açık gökyüzü', 1: 'Çoğunlukla açık', 2: 'Parçalı bulutlu', 3: 'Kapalı',
    45: 'Sis', 48: 'Kırağı sisi', 51: 'Hafif çiseleme', 53: 'Orta şiddette çiseleme',
    55: 'Yoğun çiseleme', 61: 'Hafif yağmurlu', 63: 'Orta şiddette yağmurlu',
    65: 'Şiddetli yağmurlu', 71: 'Hafif kar yağışlı', 73: 'Orta şiddette kar yağışlı',
    75: 'Yoğun kar yağışlı', 80: 'Hafif sağanak', 81: 'Orta şiddette sağanak',
    82: 'Şiddetli sağanak', 95: 'Gök gürültülü fırtına', 96: 'Dolu yağışlı fırtına',
    99: 'Ağır dolu yağışlı fırtına',
};

const weatherIcons = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌦️', 55: '🌧️', 61: '🌧️', 63: '🌧️', 65: '🌧️',
    71: '🌨️', 73: '🌨️', 75: '❄️', 80: '🌦️', 81: '🌧️', 82: '⛈️',
    95: '⛈️', 96: '⛈️', 99: '⛈️',
};

export default function Footer() {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        fetch('https://api.open-meteo.com/v1/forecast?latitude=39.93&longitude=32.86&current=temperature_2m,weather_code&timezone=Europe%2FIstanbul')
            .then(res => res.json())
            .then(data => {
                if (data.current) {
                    setWeather({
                        temp: Math.round(data.current.temperature_2m),
                        code: data.current.weather_code,
                    });
                }
            })
            .catch(() => { });
    }, []);

    const weatherDesc = weather ? (weatherDescriptions[weather.code] || 'Bilinmiyor') : '';
    const weatherIcon = weather ? (weatherIcons[weather.code] || '🌡️') : '';

    return (
        <footer className="site-footer">
            <style>{`
                /* ================================================
                   DYNAMIC ISLAND STYLE FLOATING FOOTER
                   ================================================ */
                .site-footer {
                    margin-top: 6rem; /* Üstteki içerik alanıyla karışmaması için güvenli boşluk */
                    width: 100%;
                    padding: 0 1.5rem 1.5rem 1.5rem; /* Her kenardan "bir parmak" boşluk */
                    box-sizing: border-box;
                }

                /* Sayfa yapısı flex ise footer'ı en alta itmeye devam etmesi için destek */
                @supports (display: flex) {
                    :global(body), :global(#root) {
                        display: flex;
                        flex-direction: column;
                        min-height: 100vh;
                    }
                }

                /* Dinamik Ada Görünümlü Ana Gövde */
                .footer-island {
                    max-width: var(--max-width, 1400px);
                    margin: 0 auto;
                    background-color: var(--muted-box, #0d0d0d); /* Mat, asil ada siyahı */
                    color: var(--text-color, #f5f5f7);
                    font-family: var(--font-body), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    border-radius: 28px; /* Dynamic Island tarzı yüksek kavis */
                    padding: 4rem 3rem 2.5rem 3rem;
                    border: 1px solid rgba(255, 255, 255, 0.06);
                }

                /* Üst Grid Yapısı */
                .footer-main-grid {
                    display: grid;
                    grid-template-columns: 1.6fr 1fr 1fr;
                    gap: 4rem;
                    padding-bottom: 3.5rem;
                }

                @media (max-width: 968px) {
                    .footer-main-grid {
                        grid-template-columns: 1fr;
                        gap: 2.5rem;
                        padding-bottom: 2.5rem;
                    }
                    .site-footer {
                        margin-top: 4rem; /* Mobil ekranlar için biraz daha dengeli bir boşluk */
                    }
                }

                /* Manifesto Alanı */
                .footer-manifesto {
                    font-size: 1.5rem;
                    line-height: 1.4;
                    font-weight: 400;
                    color: var(--heading-color, #ffffff);
                    max-width: 460px;
                    margin: 0;
                    letter-spacing: -0.02em;
                }

                /* Dikey Link Listeleri */
                .footer-links-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                /* Akıcı Link Hover Animasyonu */
                .footer-link-item {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    color: rgba(255, 255, 255, 0.65);
                    text-decoration: none;
                    font-size: 1.1rem;
                    font-weight: 400;
                    transition: color 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                    width: fit-content;
                }

                .footer-link-item::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 100%;
                    height: 1px;
                    background-color: var(--heading-color, #ffffff);
                    transform: scaleX(0);
                    transform-origin: right;
                    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
                }

                .footer-link-item:hover {
                    color: var(--heading-color, #ffffff);
                }

                .footer-link-item:hover::after {
                    transform: scaleX(1);
                    transform-origin: left;
                }

                /* Sosyal Medya İkon Alanı */
                .footer-social-link {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .footer-social-link img {
                    width: 18px;
                    height: 18px;
                    object-fit: contain;
                    opacity: 0.6;
                    transition: opacity 0.3s, transform 0.3s;
                }

                .footer-social-link:hover img {
                    opacity: 1;
                    transform: scale(1.1);
                }

                /* Alt İnce Bilgi Barı */
                .footer-meta-bar {
                    border-top: 1px solid rgba(255, 255, 255, 0.06);
                    padding-top: 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.8rem;
                    color: rgba(255, 255, 255, 0.4);
                }

                @media (max-width: 768px) {
                    .footer-meta-bar {
                        flex-direction: column;
                        gap: 1.5rem;
                        align-items: flex-start;
                    }
                }

                .footer-meta-left {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    flex-wrap: wrap;
                }

                @media (max-width: 768px) {
                    .footer-meta-left {
                        gap: 1rem;
                    }
                }

                .footer-meta-link {
                    color: rgba(255, 255, 255, 0.4);
                    text-decoration: none;
                    transition: color 0.3s;
                }

                .footer-meta-link:hover {
                    color: #ffffff;
                }

                /* Kutusu Kaldırılmış Saf Metin Hava Durumu */
                .footer-weather-text {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.8rem;
                }
            `}</style>

            <div className="footer-island">

                {/* Ana Link ve İçerik Gridi */}
                <div className="footer-main-grid">

                    {/* Manifesto Bölümü */}
                    <div>
                        <p className="footer-manifesto">
                            Felsefi düşünce, derinlemesine analizler ve bilimsel merak için bir sığınak.
                            Zihni genişleten dijital deneyimler tasarlıyoruz.
                        </p>
                    </div>

                    {/* Navigasyon Bölümü */}
                    <div>
                        <ul className="footer-links-list">
                            <li><Link to="/" className="footer-link-item">Denemeler</Link></li>
                            <li><Link to="/" className="footer-link-item">Uzay &amp; Bilim</Link></li>
                            <li><Link to="/" className="footer-link-item">Kültür</Link></li>
                            <li><Link to="/" className="footer-link-item">Felsefe</Link></li>
                        </ul>
                    </div>

                    {/* Sosyal Medya Bölümü */}
                    <div>
                        <ul className="footer-links-list">
                            <li>
                                <a href="https://bsky.app" target="_blank" rel="noopener noreferrer" className="footer-link-item footer-social-link">
                                    <img src="/social/Bluesky.svg" alt="" />
                                    <span>Bluesky</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="footer-link-item footer-social-link">
                                    <img src="/social/X.svg" alt="" />
                                    <span>Twitter</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Alt Kısım: Yasallar, Telif & Hava Durumu */}
                <div className="footer-meta-bar">
                    <div className="footer-meta-left">
                        <span>&copy; 2026 The Augland.</span>
                        <Link to="/" className="footer-meta-link">Gizlilik Politikası</Link>
                        <Link to="/" className="footer-meta-link">Kullanım Şartları</Link>
                        <Link to="/" className="footer-meta-link">Çerez Politikası</Link>
                    </div>

                    <div className="footer-meta-right">
                        <div className="footer-weather-text">
                            {weather ? (
                                <>
                                    <span>{weatherIcon}</span>
                                    <span>Ankara {weather.temp}°C, {weatherDesc}</span>
                                </>
                            ) : (
                                <span>Ankara ...</span>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}