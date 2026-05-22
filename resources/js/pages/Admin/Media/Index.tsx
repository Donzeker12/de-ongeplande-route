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

function totalSize(items: MediaItem[]): string {
    const total = items.reduce((sum, i) => sum + (i.size ?? 0), 0);
    return formatBytes(total);
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

    const lightboxIdx = lightbox ? media.findIndex((m) => m.id === lightbox.id) : -1;

    return (
        <>
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-white">Media Bibliotheek</h2>
                        {media.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
                                    {media.length} bestand{media.length !== 1 ? 'en' : ''}
                                </span>
                                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">
                                    {totalSize(media)}
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-100 disabled:opacity-50 transition shadow-sm"
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
                        {uploading ? 'Uploaden...' : 'Upload'}
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

            <div
                className="flex h-full"
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false); }}
                onDrop={handleDrop}
            >
                {/* Drag overlay */}
                {isDragging && (
                    <div className="fixed inset-0 z-40 bg-emerald-500/10 border-2 border-emerald-500 border-dashed pointer-events-none flex items-center justify-center">
                        <div className="bg-[#0f1117] border border-emerald-500/50 rounded-2xl px-10 py-8 text-center shadow-2xl">
                            <svg className="w-12 h-12 mx-auto mb-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <p className="text-emerald-400 font-semibold text-lg">Loslaten om te uploaden</p>
                        </div>
                    </div>
                )}

                {/* Main content */}
                <div className="flex-1 p-6 lg:p-8 min-w-0">
                    {uploadError && (
                        <div className="mb-5 flex items-center gap-3 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {uploadError}
                        </div>
                    )}

                    {media.length === 0 ? (
                        /* Empty state */
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-2xl p-16 cursor-pointer hover:border-gray-600 transition group"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition">
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-300 font-medium mb-1">Sleep foto's hierheen</p>
                            <p className="text-gray-600 text-sm">of <span className="text-emerald-400">klik om te uploaden</span> · JPG, PNG, WebP · max 10 MB</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                            {/* Upload tile */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square rounded-xl border-2 border-dashed border-gray-800 hover:border-gray-600 cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 transition flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="text-gray-600 group-hover:text-gray-400 text-xs transition">Toevoegen</span>
                            </div>

                            {media.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelected(selected?.id === item.id ? null : item)}
                                    className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                                        selected?.id === item.id
                                            ? 'ring-2 ring-white/80 ring-offset-2 ring-offset-[#0f1117] scale-[0.97]'
                                            : 'hover:scale-[0.97] hover:ring-2 hover:ring-white/20 hover:ring-offset-2 hover:ring-offset-[#0f1117]'
                                    }`}
                                >
                                    <img
                                        src={item.url}
                                        alt={item.alt || item.filename}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Hover actions */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 gap-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setLightbox(item); }}
                                            className="w-full py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs rounded-lg transition font-medium"
                                        >
                                            Vergroot
                                        </button>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); copyUrl(item); }}
                                                className="flex-1 py-1 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-xs rounded-lg transition"
                                            >
                                                {copiedId === item.id ? '✓' : 'Kopieer'}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteMedia(item); }}
                                                disabled={deletingId === item.id}
                                                className="flex-1 py-1 bg-red-500/40 hover:bg-red-500/60 backdrop-blur-sm text-white text-xs rounded-lg transition disabled:opacity-50"
                                            >
                                                {deletingId === item.id ? '...' : 'Wis'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detail panel */}
                {selected && (
                    <div className="w-72 flex-shrink-0 border-l border-gray-800/60 bg-[#0d0f14] flex flex-col">
                        {/* Preview */}
                        <div
                            className="relative cursor-zoom-in group overflow-hidden bg-black/40"
                            style={{ aspectRatio: '4/3' }}
                            onClick={() => setLightbox(selected)}
                        >
                            <img
                                src={selected.url}
                                alt={selected.alt || selected.filename}
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                </div>
                            </div>
                            {/* Close button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelected(null); }}
                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white/70 hover:text-white flex items-center justify-center text-sm transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Info */}
                        <div className="flex-1 p-5 space-y-5">
                            <div>
                                <p className="text-white font-medium text-sm break-all leading-snug">{selected.filename}</p>
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                    {selected.size && (
                                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{formatBytes(selected.size)}</span>
                                    )}
                                    {selected.mime_type && (
                                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{selected.mime_type.replace('image/', '')}</span>
                                    )}
                                </div>
                                <p className="text-gray-600 text-xs mt-2">{new Date(selected.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>

                            {/* URL */}
                            <div className="space-y-2">
                                <p className="text-xs text-gray-600 font-medium uppercase tracking-wider">Afbeelding URL</p>
                                <div className="flex gap-1.5">
                                    <input
                                        readOnly
                                        value={selected.url}
                                        className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 truncate focus:outline-none"
                                    />
                                    <button
                                        onClick={() => copyUrl(selected)}
                                        className={`px-3 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${copiedId === selected.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/8 hover:bg-white/12 text-gray-300 border border-white/10'}`}
                                    >
                                        {copiedId === selected.id ? '✓ Klaar' : 'Kopieer'}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => deleteMedia(selected)}
                                disabled={deletingId === selected.id}
                                className="w-full py-2.5 rounded-xl text-sm font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition disabled:opacity-50"
                            >
                                {deletingId === selected.id ? 'Verwijderen...' : 'Verwijder bestand'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>

        {/* Lightbox */}
        {lightbox && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-6"
                style={{ backgroundColor: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
                onClick={() => setLightbox(null)}
            >
                {/* Top bar */}
                <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent">
                    <div>
                        <p className="text-white/80 text-sm font-medium">{lightbox.filename}</p>
                        <p className="text-white/40 text-xs mt-0.5">{lightboxIdx + 1} / {media.length}</p>
                    </div>
                    <button
                        className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition text-base"
                        onClick={() => setLightbox(null)}
                    >
                        ✕
                    </button>
                </div>

                {/* Prev */}
                {lightboxIdx > 0 && (
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl transition"
                        onClick={(e) => { e.stopPropagation(); setLightbox(media[lightboxIdx - 1]); }}
                    >
                        ‹
                    </button>
                )}

                {/* Next */}
                {lightboxIdx < media.length - 1 && (
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl transition"
                        onClick={(e) => { e.stopPropagation(); setLightbox(media[lightboxIdx + 1]); }}
                    >
                        ›
                    </button>
                )}

                {/* Image */}
                <img
                    src={lightbox.url}
                    alt={lightbox.alt || lightbox.filename}
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                    style={{ maxHeight: 'calc(100vh - 120px)' }}
                    onClick={(e) => e.stopPropagation()}
                />

                {/* Bottom hint */}
                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/25 text-xs">
                    ← → navigeren · ESC sluiten
                </p>
            </div>
        )}
        </>
    );
}
