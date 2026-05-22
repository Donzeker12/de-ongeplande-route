import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

interface DraftPost {
    id: number;
    title: string;
}

interface Props {
    draftPosts: DraftPost[];
}

interface FormData {
    note: string;
    post_id: string;
    new_post_title: string;
    images: File[];
    [key: string]: string | File[];
}

export default function BlogQuickNote({ draftPosts }: Props) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
    const [mode, setMode] = useState<'new' | 'existing'>(draftPosts.length > 0 ? 'existing' : 'new');

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        note: '',
        post_id: draftPosts[0]?.id?.toString() ?? '',
        new_post_title: '',
        images: [],
    });

    const handleImages = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files);
        const newPreviews = newFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        const merged = [...previews, ...newPreviews];
        setPreviews(merged);
        setData('images', merged.map((p) => p.file));
    };

    const removeImage = (index: number) => {
        const updated = previews.filter((_, i) => i !== index);
        URL.revokeObjectURL(previews[index].url);
        setPreviews(updated);
        setData('images', updated.map((p) => p.file));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/blog/quick-note', {
            onSuccess: () => {
                reset('note', 'new_post_title');
                previews.forEach((p) => URL.revokeObjectURL(p.url));
                setPreviews([]);
                setData('images', []);
            },
            forceFormData: true,
        });
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        ✍️ Blog Notitie
                        <span className="text-sm font-normal text-gray-400">Snel opschrijven</span>
                    </h2>
                    <Link
                        href="/admin/blog"
                        className="text-sm text-gray-400 hover:text-white transition"
                    >
                        Alle posts →
                    </Link>
                </div>
            }
        >
            <Head title="Blog Notitie – Snel opschrijven" />

            <div className="max-w-lg mx-auto p-4 space-y-5">
                {/* Success flash */}
                {props.flash?.success && (
                    <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-xl flex items-center gap-2">
                        <span className="text-lg">✅</span>
                        <span>{props.flash.success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Note textarea */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            📝 Jouw notitie
                        </label>
                        <textarea
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            placeholder="Schrijf hier wat er is gebeurd... Elke enter wordt een nieuwe alinea."
                            rows={8}
                            autoFocus
                            className="w-full bg-[#1a1d27] border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-base leading-relaxed resize-none"
                        />
                        {errors.note && (
                            <p className="text-red-400 text-sm mt-1">{errors.note}</p>
                        )}
                    </div>

                    {/* Photo section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            📷 Foto's toevoegen
                        </label>

                        {/* Image previews */}
                        {previews.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                {previews.map((preview, index) => (
                                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                                        <img
                                            src={preview.url}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload buttons */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    if (fileInputRef.current) {
                                        fileInputRef.current.removeAttribute('capture');
                                        fileInputRef.current.click();
                                    }
                                }}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-xl py-3 text-sm font-medium transition"
                            >
                                <span>🖼️</span> Galerij
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (fileInputRef.current) {
                                        fileInputRef.current.setAttribute('capture', 'environment');
                                        fileInputRef.current.click();
                                    }
                                }}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-xl py-3 text-sm font-medium transition"
                            >
                                <span>📸</span> Camera
                            </button>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => handleImages(e.target.files)}
                        />
                    </div>

                    {/* Post selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            📌 Koppelen aan
                        </label>
                        <div className="flex gap-2 mb-3">
                            <button
                                type="button"
                                onClick={() => setMode('new')}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition ${
                                    mode === 'new'
                                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                                }`}
                            >
                                + Nieuwe post
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode('existing')}
                                disabled={draftPosts.length === 0}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition ${
                                    mode === 'existing'
                                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                                } disabled:opacity-40 disabled:cursor-not-allowed`}
                            >
                                Bestaande post
                            </button>
                        </div>

                        {mode === 'new' ? (
                            <div>
                                <input
                                    type="text"
                                    value={data.new_post_title}
                                    onChange={(e) => setData('new_post_title', e.target.value)}
                                    placeholder="Titel van de nieuwe post (bijv. Dag 2 – Klein Vink)"
                                    className="w-full bg-[#1a1d27] border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-base"
                                />
                                {errors.new_post_title && (
                                    <p className="text-red-400 text-sm mt-1">{errors.new_post_title}</p>
                                )}
                            </div>
                        ) : (
                            <select
                                value={data.post_id}
                                onChange={(e) => setData('post_id', e.target.value)}
                                className="w-full bg-[#1a1d27] border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-base"
                            >
                                {draftPosts.map((p) => (
                                    <option key={p.id} value={p.id.toString()}>
                                        {p.title}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing || !data.note.trim()}
                        className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl text-base transition flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <span className="animate-spin">⏳</span> Opslaan...
                            </>
                        ) : (
                            <>
                                💾 Opslaan als concept
                            </>
                        )}
                    </button>
                </form>

                {/* Recent drafts shortcut */}
                {draftPosts.length > 0 && (
                    <div className="border-t border-gray-800 pt-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Openstaande concepten</p>
                        <div className="space-y-2">
                            {draftPosts.slice(0, 5).map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/admin/blog/${p.id}/edit`}
                                    className="flex items-center justify-between px-3 py-2.5 bg-gray-800/60 hover:bg-gray-700/60 rounded-xl transition group"
                                >
                                    <span className="text-sm text-gray-300 group-hover:text-white truncate">
                                        📄 {p.title}
                                    </span>
                                    <span className="text-xs text-gray-500 shrink-0 ml-2">Bewerken →</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
