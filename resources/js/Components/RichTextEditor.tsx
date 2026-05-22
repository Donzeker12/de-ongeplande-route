import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

function ToolbarButton({
    onClick,
    active,
    title,
    children,
    disabled,
}: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault();
                onClick();
            }}
            title={title}
            disabled={disabled}
            className={`flex items-center justify-center w-9 h-9 rounded-lg transition text-sm font-medium shrink-0
                ${active ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <div className="w-px h-6 bg-gray-700 mx-0.5 shrink-0" />;
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = 'Schrijf jullie verhaal hier...',
}: RichTextEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlValue, setUrlValue] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            LinkExtension.configure({ openOnClick: false }),
            ImageExtension.configure({
                allowBase64: false,
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full my-4 mx-auto block shadow-md',
                },
            }),
            Placeholder.configure({ placeholder }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'focus:outline-none min-h-[400px] p-5 text-gray-200 prose prose-base max-w-none prose-p:my-2 prose-headings:font-bold prose-headings:text-white prose-strong:text-white prose-a:text-emerald-400 prose-blockquote:border-emerald-500 prose-blockquote:text-gray-400',
            },
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value]);

    const handleFileUpload = useCallback(
        async (file: File) => {
            if (!editor) return;
            setUploading(true);
            setUploadError(null);
            try {
                const formData = new FormData();
                formData.append('image', file);
                const { data } = await axios.post('/admin/upload-image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
            } catch {
                setUploadError('Upload mislukt. Probeer het opnieuw.');
            } finally {
                setUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        },
        [editor],
    );

    const insertImageUrl = useCallback(() => {
        if (!editor || !urlValue.trim()) return;
        editor.chain().focus().setImage({ src: urlValue.trim() }).run();
        setUrlValue('');
        setShowUrlInput(false);
    }, [editor, urlValue]);

    if (!editor) return null;

    return (
        <div className="border border-gray-700 rounded-xl [overflow:clip]">
            {/* Hidden file input — shows gallery + camera on mobile */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0]);
                    }
                }}
            />

            {/* Toolbar */}
            <div className="bg-[#1a1d27] border-b border-gray-700 p-2 space-y-2 sticky top-0 z-10">
                <div className="flex flex-wrap items-center gap-0.5">
                    {/* Text formatting */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        active={editor.isActive('bold')}
                        title="Vet (Ctrl+B)"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
                        </svg>
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        active={editor.isActive('italic')}
                        title="Cursief (Ctrl+I)"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
                        </svg>
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        active={editor.isActive('underline')}
                        title="Onderstrepen (Ctrl+U)"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
                        </svg>
                    </ToolbarButton>

                    <Divider />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        active={editor.isActive('heading', { level: 2 })}
                        title="Kop 2"
                    >
                        <span className="text-xs font-bold">H2</span>
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        active={editor.isActive('heading', { level: 3 })}
                        title="Kop 3"
                    >
                        <span className="text-xs font-bold">H3</span>
                    </ToolbarButton>

                    <Divider />

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        active={editor.isActive('bulletList')}
                        title="Opsomming"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
                        </svg>
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        active={editor.isActive('orderedList')}
                        title="Genummerde lijst"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />
                        </svg>
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        active={editor.isActive('blockquote')}
                        title="Citaat"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                        </svg>
                    </ToolbarButton>

                    <Divider />

                    {/* 📷 Upload from device (camera + gallery on mobile) */}
                    <ToolbarButton
                        onClick={() => fileInputRef.current?.click()}
                        title="Foto uploaden — kies uit galerij of maak een foto"
                        disabled={uploading}
                        active={false}
                    >
                        {uploading ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 14H4V7h4.05l1.83-2h4.24l1.83 2H20v12zM12 8c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z" />
                            </svg>
                        )}
                    </ToolbarButton>

                    {/* 🔗 Insert image via URL */}
                    <ToolbarButton
                        onClick={() => setShowUrlInput((v) => !v)}
                        title="Foto toevoegen via URL"
                        active={showUrlInput}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                    </ToolbarButton>
                </div>

                {/* URL image input */}
                {showUrlInput && (
                    <div className="flex items-center gap-2 pt-1.5 border-t border-gray-700">
                        <input
                            type="url"
                            value={urlValue}
                            onChange={(e) => setUrlValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    insertImageUrl();
                                }
                            }}
                            placeholder="https://..."
                            className="flex-1 px-3 py-1.5 bg-[#0f1117] border border-gray-600 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                        />
                        <button
                            type="button"
                            onClick={insertImageUrl}
                            className="px-3 py-1.5 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shrink-0"
                        >
                            Invoegen
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowUrlInput(false);
                                setUrlValue('');
                            }}
                            className="text-gray-500 hover:text-gray-300 transition shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {uploadError && (
                    <p className="text-xs text-red-400 px-1">{uploadError}</p>
                )}
            </div>

            {/* Editor content */}
            <div className="bg-[#0f1117]">
                <EditorContent editor={editor} />
            </div>

            {/* Upload progress */}
            {uploading && (
                <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Foto uploaden...
                </div>
            )}
        </div>
    );
}
