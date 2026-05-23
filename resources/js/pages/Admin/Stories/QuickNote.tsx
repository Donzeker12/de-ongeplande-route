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
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [storyMode, setStoryMode] = useState<'new' | 'existing'>('new');

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        youtube_url: '',
        featured_image: null as File | null,
        video_file: null as File | null,
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

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('video_file', file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const removeVideo = () => {
        setData('video_file', null);
        setData('youtube_url', '');
        setVideoPreview(null);
        if (videoInputRef.current) videoInputRef.current.value = '';
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/stories/quick-note', { forceFormData: true });
    };

    return (
        <AdminLayout
            header={
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
            }
        >
            <Head title="Snelle Notitie" />

            <div className="max-w-lg mx-auto p-4">
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* 1. Titel */}
                    <div>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Titel..."
                            autoFocus
                            className="w-full bg-[#16181f] border border-gray-700 rounded-2xl px-4 py-4 text-white text-xl font-semibold placeholder-gray-600 focus:outline-none focus:border-amber-500 transition"
                        />
                        {errors.title && <p className="mt-1 text-red-400 text-xs">{errors.title}</p>}
                    </div>

                    {/* 2. Tekst */}
                    <textarea
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        placeholder="Begin met schrijven..."
                        rows={6}
                        className="w-full bg-[#16181f] border border-gray-700 rounded-2xl px-4 py-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500 transition resize-none"
                    />

                    {/* 3. Foto */}
                    <div className="bg-[#16181f] rounded-2xl border border-gray-800 overflow-hidden">
                        {imagePreview ? (
                            <div className="relative">
                                <img src={imagePreview} alt="Preview" className="w-full h-52 object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setImagePreview(null); setData('featured_image', null); }}
                                    className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-lg font-bold transition"
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <div className="flex">
                                <label className="flex-1 flex flex-col items-center gap-1.5 py-5 cursor-pointer hover:bg-white/5 transition border-r border-gray-800">
                                    <span className="text-2xl">📸</span>
                                    <span className="text-gray-300 text-xs font-medium">Foto maken</span>
                                    <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
                                </label>
                                <label className="flex-1 flex flex-col items-center gap-1.5 py-5 cursor-pointer hover:bg-white/5 transition">
                                    <span className="text-2xl">🖼️</span>
                                    <span className="text-gray-300 text-xs font-medium">Uit gallerij</span>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </div>
                        )}
                    </div>

                    {/* 4. Video */}
                    <div className="bg-[#16181f] rounded-2xl border border-gray-800 overflow-hidden">
                        {videoPreview ? (
                            <div className="relative">
                                <video src={videoPreview} controls className="w-full max-h-52" />
                                <button
                                    type="button"
                                    onClick={removeVideo}
                                    className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-lg font-bold transition"
                                >
                                    ×
                                </button>
                            </div>
                        ) : data.youtube_url ? (
                            <div className="flex items-center gap-3 px-5 py-4">
                                <span className="text-2xl">🎬</span>
                                <span className="text-gray-300 text-sm flex-1 truncate">{data.youtube_url}</span>
                                <button type="button" onClick={removeVideo} className="text-gray-500 hover:text-red-400 transition text-xl leading-none">×</button>
                            </div>
                        ) : (
                            <div>
                                <div className="flex border-b border-gray-800">
                                    <label className="flex-1 flex flex-col items-center gap-1.5 py-5 cursor-pointer hover:bg-white/5 transition border-r border-gray-800">
                                        <span className="text-2xl">🎥</span>
                                        <span className="text-gray-300 text-xs font-medium">Video opnemen</span>
                                        <input
                                            ref={videoInputRef}
                                            type="file"
                                            accept="video/*"
                                            capture="environment"
                                            onChange={handleVideoChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <label className="flex-1 flex flex-col items-center gap-1.5 py-5 cursor-pointer hover:bg-white/5 transition">
                                        <span className="text-2xl">📂</span>
                                        <span className="text-gray-300 text-xs font-medium">Uploaden</span>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={handleVideoChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <div className="flex items-center gap-3 px-5 py-3">
                                    <span className="text-lg">▶️</span>
                                    <input
                                        type="url"
                                        value={data.youtube_url}
                                        onChange={(e) => setData('youtube_url', e.target.value)}
                                        placeholder="Of plak YouTube URL..."
                                        className="flex-1 bg-transparent text-gray-400 placeholder-gray-600 focus:outline-none text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 5. Verhaal keuze */}
                    <div className="bg-[#16181f] rounded-2xl border border-gray-800 overflow-hidden">
                        <div className="flex">
                            <button
                                type="button"
                                onClick={() => { setStoryMode('new'); setData('existing_story_id', ''); }}
                                className={`flex-1 py-4 text-sm font-medium transition ${
                                    storyMode === 'new'
                                        ? 'text-amber-400 border-b-2 border-amber-500'
                                        : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                📄 Nieuw verhaal
                            </button>
                            <button
                                type="button"
                                onClick={() => setStoryMode('existing')}
                                className={`flex-1 py-4 text-sm font-medium transition ${
                                    storyMode === 'existing'
                                        ? 'text-purple-400 border-b-2 border-purple-500'
                                        : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                🔗 Bestaand verhaal
                            </button>
                        </div>

                        {storyMode === 'existing' && (
                            <div className="px-4 py-3">
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
                                <p className="text-xs text-gray-600 mt-2">Wordt toegevoegd als nieuw hoofdstuk.</p>
                            </div>
                        )}
                    </div>

                    {/* Opslaan */}
                    <div className="flex gap-3 pb-6">
                        <button
                            type="submit"
                            disabled={processing || !data.title.trim()}
                            className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold rounded-2xl transition text-base"
                        >
                            {processing ? 'Opslaan...' : (storyMode === 'existing' && data.existing_story_id ? 'Toevoegen als hoofdstuk' : 'Opslaan')}
                        </button>
                        <Link href="/admin/stories" className="px-5 py-4 text-gray-500 hover:text-white transition text-sm flex items-center">
                            Annuleren
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
