import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useRef, useState } from 'react';

interface RecentStory {
    id: number;
    title: string;
    status: string;
}

interface Props {
    recentStories: RecentStory[];
}

export default function QuickNote({ recentStories }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [linkToExisting, setLinkToExisting] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        content: '',
        youtube_url: '',
        featured_image: null as File | null,
        existing_story_id: '',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('featured_image', file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/stories/quick-note', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/stories"
                            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Verhalen
                        </Link>
                        <span className="text-gray-600">/</span>
                        <span className="text-gray-300 text-sm">Snelle Notitie</span>
                    </div>
                </div>
            }
        >
            <Head title="Snelle Notitie" />

            <div className="max-w-lg mx-auto p-4 space-y-5">
                <div className="mb-2">
                    <h1 className="text-2xl font-bold text-white mb-1">Snelle Notitie ✍️</h1>
                    <p className="text-gray-400 text-sm">Snel iets vastleggen. Na opslaan ga je direct naar de volledige editor.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Foto / Camera */}
                    <div className="bg-[#16181f] rounded-2xl p-5 border border-gray-800">
                        <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">📷 Foto</h3>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        {imagePreview ? (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-xl border border-gray-700"
                                />
                                <button
                                    type="button"
                                    onClick={() => { setImagePreview(null); setData('featured_image', null); }}
                                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center font-bold transition"
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex-1 h-32 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-amber-500 hover:text-amber-400 transition"
                                >
                                    <span className="text-3xl mb-1">📸</span>
                                    <span className="text-xs font-medium">Camera / Gallerij</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Titel & Tekst */}
                    <div className="bg-[#16181f] rounded-2xl p-5 border border-gray-800 space-y-3">
                        <h3 className="text-base font-semibold text-white mb-1">📝 Notitie</h3>

                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Titel..."
                            autoFocus
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-lg font-semibold placeholder-gray-600 focus:outline-none focus:border-amber-500 transition"
                        />
                        {errors.title && <p className="text-red-400 text-xs">{errors.title}</p>}

                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Korte omschrijving (optioneel)..."
                            rows={2}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500 transition resize-none"
                        />

                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder="Begin met schrijven..."
                            rows={5}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500 transition resize-none"
                        />
                    </div>

                    {/* Video URL */}
                    <div className="bg-[#16181f] rounded-2xl p-5 border border-gray-800">
                        <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">🎬 Video (optioneel)</h3>
                        <input
                            type="url"
                            value={data.youtube_url}
                            onChange={(e) => setData('youtube_url', e.target.value)}
                            placeholder="YouTube URL (https://youtube.com/...)"
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500 transition"
                        />
                        {errors.youtube_url && <p className="text-red-400 text-xs mt-1">{errors.youtube_url}</p>}
                    </div>

                    {/* Koppelen aan bestaand verhaal */}
                    <div className="bg-[#16181f] rounded-2xl p-5 border border-gray-800 space-y-3">
                        <h3 className="text-base font-semibold text-white flex items-center gap-2">🔗 Koppelen aan verhaal</h3>

                        <button
                            type="button"
                            onClick={() => { setLinkToExisting(!linkToExisting); setData('existing_story_id', ''); }}
                            className={`w-full py-2.5 rounded-xl border text-sm font-medium transition ${
                                linkToExisting
                                    ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
                            }`}
                        >
                            {linkToExisting ? '✓ Toevoegen aan bestaand verhaal' : 'Toevoegen aan bestaand verhaal'}
                        </button>

                        {linkToExisting && (
                            <>
                                <select
                                    value={data.existing_story_id}
                                    onChange={(e) => setData('existing_story_id', e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                                >
                                    <option value="">Kies een verhaal...</option>
                                    {recentStories.map((story) => (
                                        <option key={story.id} value={story.id}>
                                            {story.title} ({story.status === 'published' ? 'gepubliceerd' : 'concept'})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500">De notitie wordt als nieuw hoofdstuk toegevoegd aan het gekozen verhaal.</p>
                            </>
                        )}
                    </div>

                    {/* Acties */}
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing || !data.title.trim()}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition"
                        >
                            {processing ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : '💾'}
                            {linkToExisting && data.existing_story_id ? 'Toevoegen als hoofdstuk' : 'Opslaan & verder bewerken'}
                        </button>
                        <Link href="/admin/stories" className="px-4 py-3 text-gray-400 hover:text-white transition text-sm">
                            Annuleren
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
