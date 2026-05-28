import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AdminEditorHeader({
    isEditing,
    isDraft,
    loading,
    saveMode,
    settingsOpen,
    onToggleSettings,
    onSaveDraft,
    onSavePublished
}) {
    const primaryLabel = isEditing && !isDraft ? 'Kaydet' : 'Paylaş';

    return (
        <header className="admin-editor-header">
            <div className="admin-editor-header__inner">
                <div className="admin-editor-header__left">
                    <Link to="/admin" className="admin-editor-header__back">
                        <ArrowLeft size={16} />
                        <span>Yönetime Geri Dön</span>
                    </Link>
                </div>

                <div className="admin-editor-header__right">
                    <button
                        type="button"
                        className="btn btn-secondary admin-editor-header__icon-btn"
                        onClick={onToggleSettings}
                        aria-label={settingsOpen ? 'Close editor settings' : 'Open editor settings'}
                        title={settingsOpen ? 'Close editor settings' : 'Open editor settings'}
                    >
                        <span>Ayarlar</span>
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={loading}
                        onClick={onSaveDraft}
                    >
                        <span>{saveMode === 'Taslağa Kaydet' ? 'Kaydediliyor' : 'Taslağa Kaydet'}</span>
                    </button>

                    <button
                        type="button"
                        className="btn"
                        disabled={loading}
                        onClick={onSavePublished}
                    >
                        <span>{saveMode === 'Paylaşıldı' ? 'Kaydediliyor' : primaryLabel}</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
