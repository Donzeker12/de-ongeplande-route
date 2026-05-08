import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

interface MediaItem {
    id: number;
    filename: string;
    url: string;
    mime_type: string | null;
    size: number | null;
    alt: string | null;
    created_at: string;
}

interface MediaIndexProps {
    media: MediaItem[];
}

function formatBytes(bytes: number | null): string {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaIndex({ media }: MediaIndexProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [selected, setSelected] = useState<MediaItem | null>(null);
    const [lightbox, setLightbox] = useState<MediaItem | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!lightbox) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightbox(null);
            if (e.key === 'ArrowRight') {
                const idx = media.findIndex((m) => m.id === lightbox.id);
                if (idx < media.length - 1) setLightbox(media[idx + 1]);
            }
            if (e.key === 'ArrowLeft') {
                const idx = media.findIndex((m) => m.id === lightbox.id);
                if (idx > 0) setLightbox(media[idx - 1]);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [lightbox, media]);

    const uploadFile = async (file: File) => {
        setUploading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            await axios.post('/admin/media', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            router.reload({ only: ['media'] });
        } catch {
            setUploadError('Upload mislukt. Probeer het opnieuw (max 10 MB, alleen afbeeldingen).');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;
        for (const file of Array.from(files)) {
            await uploadFile(file);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (!files?.length) return;
        for (const file of Array.from(files)) {
            if (file.type.startsWith('image/')) {
                await uploadFile(file);
            }
        }
    };

    const copyUrl = (item: MediaItem) => {
        navigator.clipboard.writeText(item.url);
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const deleteMedia = async (item: MediaItem) => {
        if (!confirm(`Weet je zeker dat je "${item.filename}" wil verwijderen?`)) return;
        setDeletingId(item.id);
        try {
            await axios.delete(`/admin/media/${item.id}`);
            if (selected?.id === item.id) setSelected(null);
            router.reload({ only: ['media'] });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">🖼️ Media Bibliotheek</h2>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition"
                    >
                        {uploading ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        )}
                        {uploading ? 'Uploaden...' : 'Foto uploaden'}
                    </button>
                </div>
            }
        >
            <Head title="Media Bibliotheek" />

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
            />

            <div className="p-6 lg:p-8">
                {/* Drop zone */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`mb-6 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${isDragging ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-700 hover:border-gray-500'}`}
                >
                    <svg className="w-10 h-10 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-400 text-sm">Sleep foto's hierheen of <span className="text-emerald-400">klik om te uploaden</span></p>
                    <p className="text-gray-600 text-xs mt-1">JPG, PNG, WebP — max 10 MB per bestand</p>
                </div>

                {uploadError && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
                        {uploadError}
                    </div>
                )}

                <div className="flex gap-6">
                    {/* Grid */}
                    <div className="flex-1">
                        {media.length === 0 ? (
                            <div className="text-center py-16 text-gray-600">
                                <p className="text-lg">Nog geen foto's geüpload</p>
                                <p className="text-sm mt-1">Upload je eerste foto hierboven</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-500 text-sm mb-4">{media.length} bestand{media.length !== 1 ? 'en' : ''}</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {media.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setSelected(item)}
                                            className={`group relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition ${selected?.id === item.id ? 'border-emerald-500 ring-2 ring-emerald-500/50' : 'border-gray-700 hover:border-gray-500'}`}
                                        >
                                            <img
                                                src={item.url}
                                                alt={item.alt || item.filename}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setLightbox(item); }}
                                                    className="px-2 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded transition"
                                                >
                                                    🔍 Vergroot
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); copyUrl(item); }}
                                                    className="px-2 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded transition"
                                                >
                                                    {copiedId === item.id ? '✓ Gekopieerd' : 'Kopieer URL'}
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteMedia(item); }}
                                                    disabled={deletingId === item.id}
                                                    className="px-2 py-1 bg-red-500/60 hover:bg-red-500/80 text-white text-xs rounded transition disabled:opacity-50"
                                                >
                                                    {deletingId === item.id ? 'Verwijderen...' : 'Verwijder'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Detail panel */}
                    {selected && (
                        <div className="w-64 flex-shrink-0 bg-[#16181f] border border-gray-800 rounded-xl p-4 space-y-4 self-start sticky top-6">
                            <div
                                className="aspect-video rounded-lg overflow-hidden border border-gray-700 cursor-zoom-in group relative"
                                onClick={() => setLightbox(selected)}
                            >
                                <img src={selected.url} alt={selected.alt || selected.filename} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <span className="text-white text-xs bg-black/60 px-2 py-1 rounded">🔍 Vergroot</span>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <p className="text-white font-medium break-all">{selected.filename}</p>
                                {selected.size && <p className="text-gray-500">{formatBytes(selected.size)}</p>}
                                {selected.mime_type && <p className="text-gray-500">{selected.mime_type}</p>}
                                <p className="text-gray-600 text-xs">{new Date(selected.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">URL</p>
                                <div className="flex gap-1">
                                    <input
                                        readOnly
                                        value={selected.url}
                                        className="flex-1 bg-[#0d0f14] border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-300 truncate"
                                    />
                                    <button
                                        onClick={() => copyUrl(selected)}
                                        className="px-2 py-1.5 bg-gray-700 hover:bg-gray-600 text-xs text-white rounded transition whitespace-nowrap"
                                    >
                                        {copiedId === selected.id ? '✓' : 'Kopieer'}
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteMedia(selected)}
                                disabled={deletingId === selected.id}
                                className="w-full py-2 bg-red-900/40 hover:bg-red-900/60 text-red-400 text-sm rounded-lg border border-red-900/40 transition disabled:opacity-50"
                            >
                                {deletingId === selected.id ? 'Verwijderen...' : 'Verwijder bestand'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>

        {/* Lightbox */}

        {lightbox && (
            <div
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                onClick={() => setLightbox(null)}
            >
                {/* Close */}
                <button
                    className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-xl transition"
                    onClick={() => setLightbox(null)}
                >
                    ✕
                </button>

                {/* Prev */}
                {media.findIndex((m) => m.id === lightbox.id) > 0 && (
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-xl transition"
                        onClick={(e) => { e.stopPropagation(); const idx = media.findIndex((m) => m.id === lightbox.id); setLightbox(media[idx - 1]); }}
                    >
                        ‹
                    </button>
                )}

                {/* Next */}
                {media.findIndex((m) => m.id === lightbox.id) < media.length - 1 && (
                    <button
                        className="absolute right-14 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-xl transition"
                        onClick={(e) => { e.stopPropagation(); const idx = media.findIndex((m) => m.id === lightbox.id); setLightbox(media[idx + 1]); }}
                    >
                        ›
                    </button>
                )}

                {/* Image */}
                <img
                    src={lightbox.url}
                    alt={lightbox.alt || lightbox.filename}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                />

                {/* Caption */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                    <p className="text-white/70 text-sm">{lightbox.filename}</p>
                    <p className="text-white/40 text-xs mt-0.5">{media.findIndex((m) => m.id === lightbox.id) + 1} / {media.length} — ESC of klik buiten om te sluiten</p>
                </div>
            </div>
        )}
        </>
    );
}
