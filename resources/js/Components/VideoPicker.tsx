import { useEffect, useRef, useState } from 'react';

interface MediaVideo {
    id: number;
    url: string;
    filename: string;
}

interface VideoPickerProps {
    value: string | null;
    onChange: (url: string | null) => void;
    mediaVideos: MediaVideo[];
}

export default function VideoPicker({ value, onChange, mediaVideos }: VideoPickerProps) {
    const [open, setOpen] = useState(false);
    const [hovered, setHovered] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

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

    const select = (url: string) => {
        onChange(url);
        setOpen(false);
    };

    return (
        <div>
            {/* Selected video preview */}
            {value ? (
                <div className="space-y-3">
                    <video
                        src={value}
                        controls
                        className="w-full rounded-lg bg-black aspect-video object-contain"
                        preload="metadata"
                    />
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium rounded-lg transition"
                        >
                            Andere video kiezen
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg transition"
                        >
                            Verwijderen
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-700 hover:border-sky-500 rounded-lg p-6 text-gray-500 hover:text-sky-400 transition"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.893L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Video kiezen uit bibliotheek</span>
                </button>
            )}

            {/* Modal */}
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
                >
                    <div
                        ref={dialogRef}
                        className="bg-[#16181f] border border-gray-700 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 shrink-0">
                            <h2 className="text-base font-semibold text-gray-100">Kies een video</h2>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="text-gray-500 hover:text-gray-300 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Grid */}
                        <div className="overflow-y-auto p-6">
                            {mediaVideos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-gray-600">
                                    <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.893L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm">Geen video's in de bibliotheek</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {mediaVideos.map((video) => (
                                        <button
                                            key={video.id}
                                            type="button"
                                            onClick={() => select(video.url)}
                                            onMouseEnter={() => setHovered(video.url)}
                                            onMouseLeave={() => setHovered(null)}
                                            className={`group relative rounded-xl overflow-hidden border-2 transition ${
                                                value === video.url
                                                    ? 'border-sky-500'
                                                    : 'border-transparent hover:border-sky-500/50'
                                            }`}
                                        >
                                            <video
                                                src={video.url}
                                                className="w-full aspect-video object-cover bg-black"
                                                preload="metadata"
                                                muted
                                                playsInline
                                                ref={(el) => {
                                                    if (!el) return;
                                                    if (hovered === video.url) {
                                                        el.play().catch(() => {});
                                                    } else {
                                                        el.pause();
                                                        el.currentTime = 0;
                                                    }
                                                }}
                                            />
                                            {value === video.url && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2 opacity-0 group-hover:opacity-100 transition">
                                                <p className="text-white text-xs truncate">{video.filename}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
