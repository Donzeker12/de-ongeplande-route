import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

interface MediaItem {
    id: number;
    filename: string;
    url: string;
    size: number | null;
    folder: string | null;
    created_at: string;
}

interface MediaPickerProps {
    open: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

export default function MediaPicker({ open, onClose, onSelect }: MediaPickerProps) {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState('');
    const [activeFolder, setActiveFolder] = useState<string | null>(null);
    const [hovered, setHovered] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            fetchMedia();
        }
    }, [open]);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/admin/media/list');
            setMedia(res.data);
        } finally {
            setLoading(false);
        }
    };

    const uploadFile = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        try {
            await axios.post('/admin/media', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await fetchMedia();
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

    const folders = Array.from(new Set(media.map((m) => m.folder).filter(Boolean))) as string[];

    const filtered = media.filter((m) => {
        const matchesSearch = m.filename.toLowerCase().includes(search.toLowerCase());
        const matchesFolder = activeFolder === null ? !m.folder : m.folder === activeFolder;
        return matchesSearch && matchesFolder;
    });

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-3xl bg-[#16181f] border border-gray-700 rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                    <h3 className="text-white font-semibold text-base">🖼️ Kies een foto</h3>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition disabled:opacity-50"
                        >
                            {uploading ? (
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            )}
                            {uploading ? 'Uploaden...' : 'Uploaden'}
                        </button>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Folder tabs */}
                {folders.length > 0 && (
                    <div className="px-5 pt-3 border-b border-gray-800 flex gap-1.5 overflow-x-auto pb-0 scrollbar-hide">
                        <button
                            type="button"
                            onClick={() => setActiveFolder(null)}
                            className={`shrink-0 px-3 py-1.5 rounded-t-lg text-xs font-medium transition border-b-2 -mb-px ${
                                activeFolder === null
                                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            Geen map
                        </button>
                        {folders.map((f) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setActiveFolder(f)}
                                className={`shrink-0 px-3 py-1.5 rounded-t-lg text-xs font-medium transition border-b-2 -mb-px ${
                                    activeFolder === f
                                        ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                                        : 'border-transparent text-gray-400 hover:text-white'
                                }`}
                            >
                                📁 {f}
                            </button>
                        ))}
                    </div>
                )}

                {/* Search */}
                <div className="px-5 py-3 border-b border-gray-800">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Zoek op bestandsnaam..."
                        className="w-full bg-[#0d0f14] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                    />
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-5">
                    {loading ? (
                        <div className="flex items-center justify-center py-16 text-gray-500">
                            <svg className="w-6 h-6 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Laden...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16 text-gray-600">
                            {search ? 'Geen resultaten voor deze zoekopdracht' : 'Nog geen foto\'s geüpload'}
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {filtered.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => { onSelect(item.url); onClose(); }}
                                    onMouseEnter={() => setHovered(item.id)}
                                    onMouseLeave={() => setHovered(null)}
                                    className="relative aspect-square rounded-lg overflow-hidden border border-gray-700 hover:border-emerald-500 transition group"
                                >
                                    <img
                                        src={item.url}
                                        alt={item.filename}
                                        className="w-full h-full object-cover"
                                    />
                                    {hovered === item.id && (
                                        <div className="absolute inset-0 bg-emerald-500/20 flex items-end">
                                            <div className="w-full px-2 py-1.5 bg-black/70">
                                                <p className="text-white text-xs truncate">{item.filename}</p>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}
