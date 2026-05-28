import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    BadgeInfo,
    Bold,
    Captions,
    Code,
    Eraser,
    GalleryVerticalEnd,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    ImagePlus,
    Images,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Minus,
    Pilcrow,
    Plus,
    Redo2,
    SquareCode,
    Strikethrough,
    TextQuote,
    Underline as UnderlineIcon,
    Undo2,
    X,
} from 'lucide-react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import { EditorContent, useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import TiptapLink from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { supabase } from '../lib/supabase';
import { buildSummary, slugifyTitle } from '../lib/postUtils';
import SourceImage from '../lib/extensions/SourceImage';
import AdminEditorHeader from '../components/AdminEditorHeader';
import './Admin.css';

function promptForImageSource(initialValue = '') {
    return window.prompt('Image source / credit (optional)', initialValue);
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function ToolbarButton({ active, title, onClick, children }) {
    return (
        <button
            type="button"
            className={`editor-tool-button ${active ? 'is-active' : ''}`.trim()}
            onClick={onClick}
            title={title}
        >
            {children}
        </button>
    );
}

function EditorToolbar({ editor, onInsertImage, onInsertImageUrl, onEditImageSource }) {
    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter a URL', previousUrl);

        if (url === null) {
            return;
        }

        if (!url.trim()) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
    };

    const hasSelectedImageSource = editor.isActive('image') && Boolean(editor.getAttributes('image').source);

    return (
        <div className="editor-toolbar custom-scrollbar" role="toolbar" aria-label="Editor tools">
            <div className="editor-toolbar__group">
                <ToolbarButton
                    title="Undo"
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    <Undo2 size={16} />
                </ToolbarButton>
                <ToolbarButton
                    title="Redo"
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    <Redo2 size={16} />
                </ToolbarButton>
            </div>

            <div className="editor-toolbar__group">
                <ToolbarButton
                    active={editor.isActive('paragraph')}
                    title="Paragraph"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                >
                    <Pilcrow size={16} />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive('heading', { level: 1 })}
                    title="Heading 1"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <Heading1 size={16} />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive('heading', { level: 2 })}
                    title="Heading 2"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 size={16} />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive('heading', { level: 3 })}
                    title="Heading 3"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 size={16} />
                </ToolbarButton>
            </div>

            <div className="editor-toolbar__group">
                <ToolbarButton
                    active={editor.isActive('bold')}
                    title="Bold"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold size={16} />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive('italic')}
                    title="Italic"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic size={16} />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive('underline')}
                    title="Underline"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <UnderlineIcon size={16} />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive('strike')}
                    title="Strikethrough"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    <Strikethrough size={16} />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive('highlight')}
                    title="Highlight"
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                >
                    <Highlighter size={16} />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive('code')}
                    title="Inline Code"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                >
                    <Code size={16} />
                </ToolbarButton>
            </div>

            <div className="editor-toolbar__group">
                <ToolbarButton
                    active={editor.isActive('bulletList')}
                    title="Bullet List"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List size={16} />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive('orderedList')}
                    title="Numbered List"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered size={16} />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive('blockquote')}
                    title="Quote"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <TextQuote size={16} />
                </ToolbarButton>
                <ToolbarButton
                    active={editor.isActive('codeBlock')}
                    title="Code Block"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                    <SquareCode size={16} />
                </ToolbarButton>
                <ToolbarButton
                    title="Divider"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                    <Minus size={16} />
                </ToolbarButton>
            </div>

            <div className="editor-toolbar__group">
                <ToolbarButton
                    active={editor.isActive('link')}
                    title="Link"
                    onClick={setLink}
                >
                    <LinkIcon size={16} />
                </ToolbarButton>
                <ToolbarButton
                    title="Upload Image"
                    onClick={onInsertImage}
                >
                    <ImagePlus size={16} />
                </ToolbarButton>
                <ToolbarButton
                    title="Insert Image URL"
                    onClick={onInsertImageUrl}
                >
                    <Images size={16} />
                </ToolbarButton>
                <ToolbarButton
                    active={hasSelectedImageSource}
                    title="Edit Image Source"
                    onClick={onEditImageSource}
                >
                    <Captions size={16} />
                </ToolbarButton>
                <ToolbarButton
                    title="Clear Formatting"
                    onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                >
                    <Eraser size={16} />
                </ToolbarButton>
            </div>
        </div>
    );
}

function SelectionBubble({ editor }) {
    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter a URL', previousUrl);

        if (url === null) {
            return;
        }

        if (!url.trim()) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
    };

    return (
        <div className="editor-bubble-menu">
            <ToolbarButton
                active={editor.isActive('bold')}
                title="Bold"
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold size={15} />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive('italic')}
                title="Italic"
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic size={15} />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive('underline')}
                title="Underline"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <UnderlineIcon size={15} />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive('highlight')}
                title="Highlight"
                onClick={() => editor.chain().focus().toggleHighlight().run()}
            >
                <Highlighter size={15} />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive('link')}
                title="Link"
                onClick={setLink}
            >
                <LinkIcon size={15} />
            </ToolbarButton>
        </div>
    );
}

function BlockInsertMenu({ editor, onInsertImage, onInsertImageUrl }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handleDocumentClick = (event) => {
            if (!event.target.closest('.block-insert-menu')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleDocumentClick);

        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
    }, [isOpen]);

    if (!editor) {
        return null;
    }

    const insertActions = [
        {
            label: 'Text',
            icon: Pilcrow,
            run: () => editor.chain().focus().setParagraph().run()
        },
        {
            label: 'Heading 1',
            icon: Heading1,
            run: () => editor.chain().focus().toggleHeading({ level: 1 }).run()
        },
        {
            label: 'Heading 2',
            icon: Heading2,
            run: () => editor.chain().focus().toggleHeading({ level: 2 }).run()
        },
        {
            label: 'Heading 3',
            icon: Heading3,
            run: () => editor.chain().focus().toggleHeading({ level: 3 }).run()
        },
        {
            label: 'Bullet List',
            icon: List,
            run: () => editor.chain().focus().toggleBulletList().run()
        },
        {
            label: 'Numbered List',
            icon: ListOrdered,
            run: () => editor.chain().focus().toggleOrderedList().run()
        },
        {
            label: 'Quote',
            icon: TextQuote,
            run: () => editor.chain().focus().toggleBlockquote().run()
        },
        {
            label: 'Code Block',
            icon: SquareCode,
            run: () => editor.chain().focus().toggleCodeBlock().run()
        },
        {
            label: 'Divider',
            icon: Minus,
            run: () => editor.chain().focus().setHorizontalRule().run()
        },
        {
            label: 'Upload Image',
            icon: ImagePlus,
            run: onInsertImage
        },
        {
            label: 'Image URL',
            icon: GalleryVerticalEnd,
            run: onInsertImageUrl
        }
    ];

    return (
        <div className={`block-insert-menu ${isOpen ? 'is-open' : ''}`.trim()}>
            <button
                type="button"
                className="block-insert-menu__trigger"
                aria-label="Insert block"
                onClick={() => setIsOpen((open) => !open)}
            >
                <Plus size={15} />
            </button>

            {isOpen && (
                <div className="block-insert-menu__panel custom-scrollbar">
                    {insertActions.map(({ label, icon: Icon, run }) => (
                        <button
                            key={label}
                            type="button"
                            className="block-insert-menu__item"
                            onClick={() => {
                                run();
                                setIsOpen(false);
                            }}
                        >
                            <Icon size={15} />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function EditorSettingsModal({
    open,
    summary,
    coverImage,
    coverImageSource,
    coverImageInputRef,
    onClose,
    onSummaryChange,
    onCoverImageSourceChange,
    onCoverImageSelect,
    onCoverImageDrop,
    onCoverImageChange
}) {
    if (!open) {
        return null;
    }

    return (
        <div className="admin-editor-modal" role="presentation" onClick={onClose}>
            <div
                className="admin-editor-modal__dialog custom-scrollbar"
                role="dialog"
                aria-modal="true"
                aria-labelledby="editor-settings-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="admin-editor-modal__header">
                    <div>
                        <span className="admin-editor-sidebar__label">
                            <BadgeInfo size={14} />
                            Notlar Düzenleniyor
                        </span>
                        <h2 id="editor-settings-title">Editör Ayarları</h2>
                        <p>Drafts stay private until you publish. Use `Ctrl/Cmd + S` for drafts and `Shift + Ctrl/Cmd + S` to publish.</p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-secondary admin-editor-modal__close"
                        onClick={onClose}
                        aria-label="Close editor settings"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="admin-editor-modal__body">
                    <div className="admin-editor-sidebar__card">
                        <div className="input-group">
                            <label htmlFor="summary">Açıklama/Özet</label>
                            <textarea
                                id="summary"
                                className="input-field admin-editor-textarea custom-scrollbar"
                                rows="5"
                                value={summary}
                                onChange={(event) => onSummaryChange(event.target.value)}
                                placeholder="This will be used on cards and previews."
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="coverImageSource">Kapak Görseli Kaynağı</label>
                            <input
                                id="coverImageSource"
                                type="text"
                                className="input-field"
                                value={coverImageSource}
                                onChange={(event) => onCoverImageSourceChange(event.target.value)}
                                placeholder="Image: NASA / JPL"
                            />
                        </div>
                    </div>

                    <div className="admin-editor-sidebar__card">
                        <div className="input-group">
                            <label>Cover image</label>
                            <div
                                className="cover-image-uploader"
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={onCoverImageDrop}
                            >
                                {coverImage ? (
                                    <img src={coverImage} alt="Cover preview" className="cover-preview" />
                                ) : (
                                    <div className="upload-placeholder">
                                        Sürükle bırak, kopyala ya da aşağıdaki butonu kullanarak kapak görseli ekleyin.
                                    </div>
                                )}

                                <div className="upload-actions">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => coverImageInputRef.current?.click()}
                                    >
                                        <ImagePlus size={16} />
                                        <span>Karşıya Yükle</span>
                                    </button>
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={coverImageInputRef}
                                    onChange={onCoverImageSelect}
                                    className="visually-hidden"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="coverImageUrl">Kapak Görseli URL</label>
                            <input
                                id="coverImageUrl"
                                type="url"
                                className="input-field"
                                value={coverImage}
                                onChange={(event) => onCoverImageChange(event.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminAddEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const titleInputRef = useRef(null);
    const editorImageInputRef = useRef(null);
    const coverImageInputRef = useRef(null);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [slugTouched, setSlugTouched] = useState(false);
    const [summary, setSummary] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [coverImageSource, setCoverImageSource] = useState('');
    const [initialContent, setInitialContent] = useState('');
    const [publishedAt, setPublishedAt] = useState(null);
    const [activeSaveMode, setActiveSaveMode] = useState('');
    const [saveError, setSaveError] = useState('');
    const [settingsOpen, setSettingsOpen] = useState(false);

    const isDraft = !publishedAt;
    const isSaving = Boolean(activeSaveMode);

    const insertImageWithAttributes = useCallback(async (editorInstance, file, source = '') => {
        if (!editorInstance || !file) {
            return;
        }

        const src = await readFileAsDataUrl(file);
        editorInstance.chain().focus().setImage({ src, source }).run();
    }, []);

    const handleEditorPaste = useCallback((view, event) => {
        const items = event.clipboardData?.items || [];

        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (!file) {
                    return false;
                }

                const reader = new FileReader();
                reader.onload = (loadEvent) => {
                    const source = promptForImageSource('') ?? '';
                    const node = view.state.schema.nodes.image.create({
                        src: loadEvent.target.result,
                        source
                    });
                    const transaction = view.state.tr.replaceSelectionWith(node);
                    view.dispatch(transaction);
                };
                reader.readAsDataURL(file);
                event.preventDefault();
                return true;
            }
        }

        return false;
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3]
                }
            }),
            Underline,
            TiptapLink.configure({
                openOnClick: false,
                HTMLAttributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer'
                }
            }),
            SourceImage.configure({
                inline: false,
                allowBase64: true
            }),
            Highlight.configure({
                multicolor: true
            })
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'admin-prosemirror'
            },
            handlePaste: handleEditorPaste,
            handleDrop: (view, event, _slice, moved) => {
                if (moved) {
                    return false;
                }

                const file = event.dataTransfer?.files?.[0];
                if (!file || !file.type.startsWith('image/')) {
                    return false;
                }

                const reader = new FileReader();
                reader.onload = (loadEvent) => {
                    const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                    if (!coordinates) {
                        return;
                    }

                    const source = promptForImageSource('') ?? '';
                    const node = view.state.schema.nodes.image.create({
                        src: loadEvent.target.result,
                        source
                    });
                    const transaction = view.state.tr.insert(coordinates.pos, node);
                    view.dispatch(transaction);
                };
                reader.readAsDataURL(file);
                event.preventDefault();

                return true;
            }
        }
    });

    useEffect(() => {
        document.title = isEditing ? 'Edit Essay | Admin' : 'New Essay | Admin';

        return () => {
            document.title = 'The Augland';
        };
    }, [isEditing]);

    useEffect(() => {
        if (!isEditing) {
            return undefined;
        }

        let isMounted = true;

        async function fetchPost() {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', id)
                .single();

            if (!isMounted || error || !data) {
                return;
            }

            setTitle(data.title || '');
            setSlug(data.slug || '');
            setSlugTouched(true);
            setSummary(data.summary || '');
            setCoverImage(data.cover_image || '');
            setCoverImageSource(data.cover_image_source || '');
            setInitialContent(data.content || '');
            setPublishedAt(data.published_at || null);
        }

        fetchPost();

        return () => {
            isMounted = false;
        };
    }, [id, isEditing]);

    useEffect(() => {
        if (!editor) {
            return;
        }

        editor.commands.setContent(initialContent || '');
    }, [editor, initialContent]);

    useEffect(() => {
        const element = titleInputRef.current;
        if (!element) {
            return;
        }

        element.style.height = '0px';
        element.style.height = `${element.scrollHeight}px`;
    }, [title]);

    const openEditorImagePicker = () => {
        editorImageInputRef.current?.click();
    };

    const insertImageFromUrl = () => {
        if (!editor) {
            return;
        }

        const url = window.prompt('Image URL');
        if (!url?.trim()) {
            return;
        }

        const source = promptForImageSource('') ?? '';
        editor.chain().focus().setImage({
            src: url.trim(),
            source
        }).run();
    };

    const editSelectedImageSource = () => {
        if (!editor?.isActive('image')) {
            return;
        }

        const currentSource = editor.getAttributes('image').source || '';
        const nextSource = promptForImageSource(currentSource);

        if (nextSource === null) {
            return;
        }

        editor.chain().focus().updateAttributes('image', { source: nextSource.trim() }).run();
    };

    const handleEditorImageSelect = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const source = promptForImageSource('') ?? '';
            await insertImageWithAttributes(editor, file, source);
        }

        event.target.value = '';
    };

    const handleCoverImageSelect = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            setCoverImage(loadEvent.target.result);
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    const handleTitleChange = (event) => {
        const nextTitle = event.target.value.replace(/\s*\n+\s*/g, ' ');
        setTitle(nextTitle);

        if (!slugTouched) {
            setSlug(slugifyTitle(nextTitle));
        }
    };

    const persistPost = useCallback(async (mode) => {
        const content = editor?.getHTML() || '';
        const normalizedTitle = title.trim() || (mode === 'draft' ? 'Untitled draft' : '');
        const normalizedSlug = slugifyTitle(slug) || slugifyTitle(title) || (mode === 'draft' ? `draft-${Date.now()}` : '');
        const normalizedSummary = summary.trim() || buildSummary(content, title);

        if (!normalizedTitle) {
            setSaveError('A title is required before publishing.');
            return;
        }

        if (!normalizedSlug) {
            setSaveError('A slug is required before publishing.');
            return;
        }

        setSaveError('');
        setActiveSaveMode(mode);

        const nextPublishedAt = mode === 'draft'
            ? null
            : (publishedAt || new Date().toISOString());

        const postData = {
            title: normalizedTitle,
            slug: normalizedSlug,
            summary: normalizedSummary,
            cover_image: coverImage.trim(),
            cover_image_source: coverImageSource.trim(),
            content,
            published_at: nextPublishedAt
        };

        const query = isEditing
            ? supabase.from('posts').update(postData).eq('id', id)
            : supabase.from('posts').insert([postData]);

        const { error } = await query;

        if (error) {
            setSaveError(error.message);
            setActiveSaveMode('');
            return;
        }

        setTitle(normalizedTitle);
        setSlug(normalizedSlug);
        setSummary(normalizedSummary);
        setPublishedAt(nextPublishedAt);
        setActiveSaveMode('');
        navigate('/admin');
    }, [coverImage, coverImageSource, editor, id, isEditing, navigate, publishedAt, slug, summary, title]);

    useEffect(() => {
        const handleKeydown = (event) => {
            if (event.key === 'Escape') {
                setSettingsOpen(false);
                return;
            }

            if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 's') {
                return;
            }

            event.preventDefault();

            if (event.shiftKey) {
                persistPost('published');
                return;
            }

            persistPost('draft');
        };

        window.addEventListener('keydown', handleKeydown);

        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [persistPost]);

    const handleCoverImageDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (!file || !file.type.startsWith('image/')) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            setCoverImage(loadEvent.target.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <main className="admin-editor-page">
            <AdminEditorHeader
                title={title}
                isEditing={isEditing}
                isDraft={isDraft}
                loading={isSaving}
                saveMode={activeSaveMode}
                settingsOpen={settingsOpen}
                onToggleSettings={() => setSettingsOpen((open) => !open)}
                onSaveDraft={() => persistPost('draft')}
                onSavePublished={() => persistPost('published')}
            />

            <div className="admin-editor-workspace">
                <aside className="admin-editor-toolbar-shell">
                    <EditorToolbar
                        editor={editor}
                        onInsertImage={openEditorImagePicker}
                        onInsertImageUrl={insertImageFromUrl}
                        onEditImageSource={editSelectedImageSource}
                    />
                </aside>

                <section className="admin-editor-main">
                    <div className="admin-editor-canvas">
                        <textarea
                            ref={titleInputRef}
                            className="admin-editor-title-input"
                            placeholder="Başlıksız"
                            value={title}
                            onChange={handleTitleChange}
                            rows={1}
                        />

                        <div className="admin-editor-route-meta">
                            <span className="admin-editor-route-meta__prefix">{isDraft ? '/draft/' : '/blog/'}</span>
                            <input
                                type="text"
                                value={slug}
                                onChange={(event) => {
                                    setSlugTouched(true);
                                    setSlug(event.target.value);
                                }}
                                placeholder="deneme-url"
                                aria-label="Post slug"
                            />
                        </div>

                        {saveError && (
                            <div className="error-message admin-editor-error">
                                {saveError}
                            </div>
                        )}

                        {editor && (
                            <>
                                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                                    <SelectionBubble editor={editor} />
                                </BubbleMenu>

                                <FloatingMenu
                                    editor={editor}
                                    shouldShow={({ state }) => {
                                        const { $from } = state.selection;
                                        return state.selection.empty
                                            && $from.parent.type.name === 'paragraph'
                                            && $from.parent.textContent.length === 0;
                                    }}
                                    tippyOptions={{
                                        duration: 100,
                                        placement: 'left-start',
                                        interactive: true,
                                        offset: [-20, 6]
                                    }}
                                >
                                    <BlockInsertMenu
                                        editor={editor}
                                        onInsertImage={openEditorImagePicker}
                                        onInsertImageUrl={insertImageFromUrl}
                                    />
                                </FloatingMenu>
                            </>
                        )}

                        <EditorContent editor={editor} className="admin-editor-content" />
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        ref={editorImageInputRef}
                        onChange={handleEditorImageSelect}
                        className="visually-hidden"
                    />
                </section>
            </div>

            <EditorSettingsModal
                open={settingsOpen}
                summary={summary}
                coverImage={coverImage}
                coverImageSource={coverImageSource}
                coverImageInputRef={coverImageInputRef}
                onClose={() => setSettingsOpen(false)}
                onSummaryChange={setSummary}
                onCoverImageSourceChange={setCoverImageSource}
                onCoverImageSelect={handleCoverImageSelect}
                onCoverImageDrop={handleCoverImageDrop}
                onCoverImageChange={setCoverImage}
            />
        </main>
    );
}
