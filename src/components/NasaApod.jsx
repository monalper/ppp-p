import { useEffect, useState } from 'react';
import './NasaApod.css';

export default function NasaApod() {
    const [apodData, setApodData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiKey = import.meta.env.VITE_NASA_APOD_API_KEY;

        fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
            .then((response) => response.json())
            .then((data) => {
                setApodData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching NASA APOD:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="nasa-apod-loading">NASA APOD Yükleniyor...</div>;
    }

    if (!apodData) {
        return null;
    }

    const MAX_LENGTH = 220;
    const isLong = apodData.explanation.length > MAX_LENGTH;
    const shortText = isLong
        ? `${apodData.explanation.slice(0, MAX_LENGTH)}...`
        : apodData.explanation;
    const officialUrl = 'https://apod.nasa.gov/apod/astropix.html';

    return (
        <section className="nasa-apod-container">
            <div className="nasa-apod-image-wrapper">
                {apodData.media_type === 'video' ? (
                    <iframe
                        src={apodData.url}
                        title={apodData.title}
                        frameBorder="0"
                        allow="encrypted-media"
                        allowFullScreen
                        className="nasa-apod-media"
                    />
                ) : (
                    <img
                        src={apodData.url}
                        alt={apodData.title}
                        className="nasa-apod-media"
                    />
                )}
            </div>

            <div className="nasa-apod-content">
                <h3 className="nasa-apod-title">
                    {apodData.title}
                </h3>

                <p className="nasa-apod-desc">
                    {shortText}

                    {isLong && (
                        <a
                            href={officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nasa-apod-readmore"
                        >
                            (+)
                        </a>
                    )}
                </p>

                <div className="nasa-apod-links">
                    {apodData.hdurl && (
                        <a
                            href={apodData.hdurl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nasa-apod-link"
                        >
                            <span>Yüksek Çözünürlükte Aç</span>
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
