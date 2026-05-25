import { useEffect, useRef, useState } from 'react';

interface MediaImage {
    id: number;
    url: string;
    filename: string;
    folder?: string | null;
}

interface GalleryPickerProps {
    value: string[];
    onChange: (urls: string[]) => void;
    mediaImages: MediaImage[];
}

export default function GalleryPicker({ value, onChange, mediaImages }: GalleryPickerProps) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Set<string>>(new Set(value));
    const [search, setSearch] = useState('');
    const [activeFolder, setActiveFolder] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

    // Sync external value changes (e.g. on initial load)
    useEffect(() => {
        setSelected(new Set(value));
    }, [value.join(',')]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [open]);

    const toggle = (url: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(url)) {
                next.delete(url);
            } else {
                next.add(url);
            }
            return next;
        });
    };

    const confirm = () => {
        // Preserve existing order, append new ones at end
        const next = value.filter((u) => selected.has(u));
        const added = [...selected].filter((u) => !value.includes(u));
        onChange([...next, ...added]);
        setOpen(false);
    };

    const remove = (url: string) => {
        onChange(value.filter((u) => u !== url));
    };

    const moveUp = (idx: number) => {
        if (idx === 0) return;
        const next = [...value];
        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
        onChange(next);
    };

    const moveDown = (idx: number) => {
        if (idx === value.length - 1) return;
        const next = [...value];
        [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
        onChange(next);
    };

    return (
        <div>
            {/* Selected photos grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                    {value.map((url, idx) => (
                        <div key={url} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-700 bg-[#0f1117]">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            {/* Order controls */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1">
                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        onClick={() => moveUp(idx)}
                                        disabled={idx === 0}
                                        className="p-1 bg-black/60 rounded text-white disabled:opacity-30 hover:bg-black/80 transition"
                                        title="Naar voren"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveDown(idx)}
                                        disabled={idx === value.length - 1}
                                        className="p-1 bg-black/60 rounded text-white disabled:opacity-30 hover:bg-black/80 transition"
                                        title="Naar achteren"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => remove(url)}
                                    className="p-1 bg-red-600/80 rounded text-white hover:bg-red-600 transition"
                                    title="Verwijderen"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            {/* Index badge */}
                            <span className="absolute top-1 left-1 text-[10px] font-bold bg-black/60 text-white rounded px-1 py-0.5">
                                {idx + 1}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <button
                type="button"
                onClick={() => {
                    setSelected(new Set(value));
                    setOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-emerald-500 hover:text-emerald-400 transition text-sm"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {value.length > 0 ? `${value.length} foto${value.length !== 1 ? "'s" : ''} — bewerken` : "Foto's kiezen uit bibliotheek"}
            </button>

            {/* Modal */}
            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
                >
                    <div
                        ref={dialogRef}
                        className="bg-[#16181f] border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
                            <div>
                                <h3 className="text-white font-semibold">Foto's kiezen</h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {selected.size} geselecteerd — klik om te selecteren/deselecteren
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="p-2 text-gray-400 hover:text-white transition rounded-lg hover:bg-gray-800"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Folder tabs + search */}
                        {(() => {
                            const folders = Array.from(new Set(mediaImages.map((m) => m.folder).filter(Boolean))) as string[];
                            const filtered = mediaImages.filter((m) => {
                                const matchesSearch = m.filename.toLowerCase().includes(search.toLowerCase());
                                const matchesFolder = activeFolder === null ? !m.folder : m.folder === activeFolder;
                                return matchesSearch && matchesFolder;
                            });
                            return (
                                <>
                                    {folders.length > 0 && (
                                        <div className="px-4 pt-3 border-b border-gray-800 flex gap-1.5 overflow-x-auto pb-0">
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
                                    <div className="px-4 py-2 border-b border-gray-800 shrink-0">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Zoek op bestandsnaam..."
                                            className="w-full bg-[#0d0f14] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                                        />
                                    </div>

                                    {/* Grid */}
                                    <div className="overflow-y-auto flex-1 p-4">
                                        {mediaImages.length === 0 ? (
                                            <div className="text-center py-16 text-gray-500">
                                                <p>Geen foto's in de mediabibliotheek.</p>
                                                <p className="text-xs mt-1">Upload eerst foto's via Media → Foto's.</p>
                                            </div>
                                        ) : filtered.length === 0 ? (
                                            <div className="text-center py-16 text-gray-500">
                                                <p>Geen foto's gevonden.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                                    {filtered.map((img) => {
                                                        const isSelected = selected.has(img.url);
                                                        return (
                                                            <button
                                                                key={img.id}
                                                                type="button"
                                                                onClick={() => toggle(img.url)}
                                                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition focus:outline-none ${
                                                                    isSelected
                                                                        ? 'border-emerald-500 ring-2 ring-emerald-500/40'
                                                                        : 'border-transparent hover:border-gray-500'
                                                                }`}
                                                            >
                                                                <img
                                                                    src={img.url}
                                                                    alt={img.filename}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                {isSelected && (
                                                                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                                                                        <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                        )}
                                    </div>
                                </>
                            );
                        })()}

                        {/* Footer */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 shrink-0">
                            <button
                                type="button"
                                onClick={() => setSelected(new Set())}
                                className="text-sm text-gray-400 hover:text-white transition"
                            >
                                Alles deselecteren
                            </button>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                                >
                                    Annuleren
                                </button>
                                <button
                                    type="button"
                                    onClick={confirm}
                                    className="px-4 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition font-medium"
                                >
                                    {selected.size > 0 ? `${selected.size} foto${selected.size !== 1 ? "'s" : ''} toevoegen` : 'Bevestigen'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
