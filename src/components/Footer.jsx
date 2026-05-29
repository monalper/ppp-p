import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const weatherDescriptions = {
    0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Freezing Fog', 51: 'Light Drizzle', 53: 'Moderate Drizzle',
    55: 'Dense Drizzle', 61: 'Light Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
    71: 'Light Snow', 73: 'Moderate Snow', 75: 'Heavy Snow', 80: 'Light Showers',
    81: 'Moderate Showers', 82: 'Heavy Showers', 95: 'Thunderstorm',
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

    const weatherDesc = weather ? (weatherDescriptions[weather.code] || '') : '';

    return (
        <footer className="museum-footer">
            <style>{`
                .museum-footer {
                    width: 100%;
                    background-color: #EFEEEC;
                    color: #111212;
                    font-family: 'Geist', sans-serif;
                    position: relative;
                    z-index: 10;
                    box-sizing: border-box;
                    /* Üstteki grid ile kenetlenmesi için 4px border ve negatif margin */
                    border: 4px solid #111212;
                    margin-top: -4px;
                }

                .footer-grid-top {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    position: relative;
                    z-index: 2;
                }

                @media (max-width: 768px) {
                    .footer-grid-top {
                        grid-template-columns: 1fr;
                    }
                }

                .footer-column {
                    display: flex;
                    flex-direction: column;
                    padding: 3rem;
                    border-right: 4px solid #111212;
                    border-bottom: 4px solid #111212;
                    margin-right: -4px;
                    box-sizing: border-box;
                }

                .footer-column:last-child {
                    border-right: none;
                    margin-right: 0;
                }

                @media (max-width: 768px) {
                    .footer-column {
                        border-right: none;
                        margin-right: 0;
                        padding: 2rem 1.5rem;
                    }
                }

                .footer-col-title {
                    font-size: 0.85rem;
                    letter-spacing: -0.02em;
                    text-transform: lowercase;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                }

                .footer-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .footer-link {
                    color: #111212;
                    text-decoration: none;
                    font-size: 1.25rem;
                    line-height: 1.2;
                    font-weight: 500;
                    width: fit-content;
                    text-transform: lowercase;
                }

                /* Hover opaklık düşürme efekti kaldırıldı, net görünüm korundu */
                .footer-link:hover {
                    text-decoration: underline;
                    text-decoration-thickness: 2px;
                }

                .footer-manifesto-text {
                    font-size: 1.75rem;
                    line-height: 1.1;
                    font-weight: 500;
                    letter-spacing: -0.04em;
                    margin: 0;
                    text-transform: lowercase;
                }

                .footer-bottom {
                    padding: 2rem 3rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                    z-index: 2;
                    box-sizing: border-box;
                }

                @media (max-width: 768px) {
                    .footer-bottom {
                        flex-direction: column-reverse;
                        align-items: flex-start;
                        gap: 1.5rem;
                        padding: 1.5rem;
                    }
                }

                .footer-legal {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                    font-size: 0.85rem;
                    text-transform: lowercase;
                    font-weight: 500;
                }

                .footer-legal-link {
                    color: inherit;
                    text-decoration: none;
                }
                
                .footer-legal-link:hover {
                    text-decoration: underline;
                }

                .weather-station {
                    font-size: 0.85rem;
                    text-transform: lowercase;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
            `}</style>

            <div className="footer-grid-top">
                <div className="footer-column">
                    <p className="footer-manifesto-text">
                        a sanctuary for philosophical thought, deep analysis, and scientific curiosity. we design mind-expanding digital experiences.
                    </p>
                </div>

                <div className="footer-column" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '2rem' }}>
                    <div>
                        <div className="footer-col-title">// index</div>
                        <nav className="footer-nav">
                            <Link to="/" className="footer-link">Essays</Link>
                            <Link to="/" className="footer-link">Space & Science</Link>
                            <Link to="/" className="footer-link">Culture</Link>
                            <Link to="/" className="footer-link">Philosophy</Link>
                        </nav>
                    </div>

                    <div>
                        <div className="footer-col-title">// connect</div>
                        <nav className="footer-nav">
                            <a href="https://bsky.app" target="_blank" rel="noopener noreferrer" className="footer-link">Bluesky</a>
                            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="footer-link">Twitter</a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">Github</a>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-legal">
                    <span>&copy; {new Date().getFullYear()} the augland</span>
                    <Link to="/" className="footer-legal-link">privacy</Link>
                    <Link to="/" className="footer-legal-link">terms</Link>
                    <Link to="/" className="footer-legal-link">cookies</Link>
                </div>

                <div className="weather-station">
                    {weather ? (
                        <span>ankara, {weather.temp}°c — {weatherDesc.toLowerCase()}</span>
                    ) : (
                        <span>ankara, station offline</span>
                    )}
                </div>
            </div>
        </footer>
    );
}