import { Link } from 'react-router-dom';
import { getPostPath } from '../lib/postUtils';

export default function PostCard({ post }) {
    const hasImage = Boolean(post.cover_image);

    return (
        <Link to={getPostPath(post)} className="post-card">
            <div className="post-card-image">
                {hasImage ? (
                    <img src={post.cover_image} alt={post.title} />
                ) : (
                    <div className="placeholder-image">
                        <span>Augland</span>
                    </div>
                )}
            </div>
            <div className="post-card-content">
                <h2 className="post-card-title">{post.title}</h2>
                <p className="post-card-summary">{post.summary}</p>
            </div>
        </Link>
    );
}
