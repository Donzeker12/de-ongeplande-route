import React, { useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ImageUpload from '@/Components/ImageUpload';

interface Chapter {
    id?: number;
    title: string;
    content: string;
    order: number;
}

interface Story {
    id: number;
    title: string;
    description: string;
    youtube_url: string | null;
    featured_image: string | null;
    slug: string | null;
    status: 'draft' | 'generating' | 'completed' | 'published';
    ai_settings: {
        tone: string;
        length: string;
        style: string;
    };
    chapters: Chapter[];
    generated_content: string | null;
}

interface Props {
    story: Story;
}

export default function EditStory({ story }: Props) {
    const { data, setData, put, patch, processing, errors } = useForm({
        title: story.title,
        description: story.description || '',
        youtube_url: story.youtube_url || '',
        featured_image: story.featured_image || '',
        ai_settings: story.ai_settings || {
            tone: 'vriendelijk',
            length: 'medium',
            style: 'verhaal'
        },
        chapters: story.chapters || []
    });

    const getYoutubeEmbedUrl = (url: string): string | null => {
        try {
            const parsed = new URL(url);
            let videoId: string | null = null;
            if (parsed.hostname === 'youtu.be') {
                videoId = parsed.pathname.slice(1);
            } else if (parsed.hostname.includes('youtube.com')) {
                videoId = parsed.searchParams.get('v');
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        } catch {
            return null;
        }
    };

    const [isGenerating, setIsGenerating] = useState(story.status === 'generating');
    const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>(() => {
        if (story.status === 'generating') return 'generating';
        if (story.status === 'completed') return 'success';
        return 'idle';
    });
    const [generationMessage, setGenerationMessage] = useState('');

    const addChapter = () => {
        const newOrder = Math.max(...data.chapters.map(c => c.order || 0), 0) + 1;
        setData('chapters', [...data.chapters, { title: '', content: '', order: newOrder }]);
    };

    const removeChapter = (index: number) => {
        const newChapters = data.chapters.filter((_, i) => i !== index);
        setData('chapters', newChapters);
    };

    const updateChapter = (index: number, field: keyof Chapter, value: string) => {
        const newChapters = [...data.chapters];
        newChapters[index] = { ...newChapters[index], [field]: value };
        setData('chapters', newChapters);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.stories.update', story.id));
    };

    const handleGenerateStory = () => {
        setIsGenerating(true);
        setGenerationStatus('generating');
        setGenerationMessage('AI begint met verhaal schrijven...');

        // Use router.post since the route is defined as POST
        router.post(route('admin.stories.generate', story.id), {}, {
            onSuccess: () => {
                setGenerationStatus('success');
                setGenerationMessage('🎉 Verhaal succesvol gegenereerd!');
                
                // Visit the current page again to refresh the story data
                setTimeout(() => {
                    router.visit(route('admin.stories.edit', story.id), {
                        preserveScroll: true,
                        replace: true
                    });
                }, 1000);
            },
            onError: (errors) => {
                setGenerationStatus('error');
                setGenerationMessage('❌ Er ging iets mis bij het genereren. Probeer het opnieuw.');
                console.error('Generation error:', errors);
            },
            onFinish: () => setIsGenerating(false)
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return <span className="px-3 py-1 bg-gray-600 text-gray-200 rounded-lg text-sm">📝 Concept</span>;
            case 'generating':
                return <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">🤖 Genereren...</span>;
            case 'completed':
                return <span className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm">✅ Voltooid</span>;
            case 'published':
                return <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">🚀 Gepubliceerd</span>;
            default:
                return <span className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm">{status}</span>;
        }
    };

    return (
        <AdminLayout>
            <Head title={`Bewerk Story: ${story.title}`} />

            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/admin/stories"
                                    className="text-gray-400 hover:text-white"
                                >
                                    ← Terug naar Stories
                                </Link>
                            </div>
                            <div className="flex items-center gap-3">
                                {getStatusBadge(story.status)}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-4xl">✍️</span>
                            <h1 className="text-3xl font-bold text-white">
                                Story Bewerken
                            </h1>
                        </div>
                        <p className="text-gray-300 text-lg">
                            Bewerk je story en laat AI er een compleet verhaal van maken!
                        </p>
                    </div>

                    {/* Generation Status Bar */}
                    {generationStatus !== 'idle' && (
                        <div className={`rounded-2xl p-6 mb-8 border-2 ${
                            generationStatus === 'generating' 
                                ? 'bg-blue-900/20 border-blue-500 text-blue-200' 
                                : generationStatus === 'success'
                                ? 'bg-green-900/20 border-green-500 text-green-200'
                                : 'bg-red-900/20 border-red-500 text-red-200'
                        }`}>
                            <div className="flex items-center gap-4">
                                {generationStatus === 'generating' && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 border-4 border-blue-300/30 border-t-blue-300 rounded-full animate-spin"></div>
                                        <div>
                                            <h3 className="font-bold text-lg">🤖 AI aan het werk...</h3>
                                            <p className="text-sm opacity-90">Gemini Flash schrijft jouw verhaal</p>
                                        </div>
                                    </div>
                                )}
                                
                                {generationStatus === 'success' && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                            ✓
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">✅ Verhaal voltooid!</h3>
                                            <p className="text-sm opacity-90">Je story is succesvol gegenereerd</p>
                                        </div>
                                    </div>
                                )}
                                
                                {generationStatus === 'error' && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                                            !
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">❌ Generatie mislukt</h3>
                                            <p className="text-sm opacity-90">Er ging iets mis, probeer het opnieuw</p>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="ml-auto">
                                    {generationStatus !== 'generating' && (
                                        <button
                                            onClick={() => setGenerationStatus('idle')}
                                            className="text-current opacity-60 hover:opacity-100 p-1"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {generationStatus === 'generating' && (
                                <div className="mt-4">
                                    <div className="w-full bg-blue-800/30 rounded-full h-2">
                                        <div className="bg-blue-400 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                                    </div>
                                    <p className="text-xs mt-2 opacity-75">Dit kan 1-2 minuten duren...</p>
                                </div>
                            )}
                            
                            {generationStatus === 'success' && (
                                <div className="mt-3 space-y-2">
                                    <div className="text-sm opacity-90">
                                        Data wordt bijgewerkt...
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => router.visit(route('admin.stories.edit', story.id), {preserveScroll: true, replace: true})}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            🔄 Refresh Data
                                        </button>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            🔄 Hard Reload
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Generated Content Preview */}
                    {story.status === 'completed' && story.generated_content && (
                        <div className="bg-green-900/20 border border-green-600 rounded-2xl p-8 mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">🤖</span>
                                <h2 className="text-xl font-semibold text-green-300">AI Generated Story</h2>
                            </div>
                            <div className="bg-gray-800 rounded-xl p-6 max-h-96 overflow-y-auto">
                                <div className="text-gray-200 whitespace-pre-wrap">
                                    {story.generated_content}
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-8">
                        {/* Story Info Card */}
                        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-2xl">📖</span>
                                <h2 className="text-xl font-semibold text-white">Story Informatie</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        Story Titel *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        Beschrijving / AI Prompt
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Vertel AI hoe je het verhaal wilt hebben..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        🎬 YouTube Video (optioneel)
                                    </label>
                                    <input
                                        type="url"
                                        value={data.youtube_url}
                                        onChange={(e) => setData('youtube_url', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                    {errors.youtube_url && <p className="text-red-400 text-sm mt-1">{errors.youtube_url}</p>}
                                    {data.youtube_url && getYoutubeEmbedUrl(data.youtube_url) && (
                                        <div className="mt-4 rounded-xl overflow-hidden aspect-video">
                                            <iframe
                                                src={getYoutubeEmbedUrl(data.youtube_url)!}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        🖼️ Omslagfoto (optioneel)
                                    </label>
                                    <ImageUpload
                                        value={data.featured_image}
                                        onChange={(url) => setData('featured_image', url ?? '')}
                                    />
                                    {errors.featured_image && <p className="text-red-400 text-sm mt-1">{errors.featured_image}</p>}
                                </div>
                            </div>
                        </div>

                        {/* AI Settings Card */}
                        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-2xl">🤖</span>
                                <h2 className="text-xl font-semibold text-white">AI Instellingen</h2>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">Toon</label>
                                    <select
                                        value={data.ai_settings?.tone}
                                        onChange={(e) => setData('ai_settings', { ...data.ai_settings, tone: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="vriendelijk">Vriendelijk</option>
                                        <option value="avontuurlijk">Avontuurlijk</option>
                                        <option value="grappig">Grappig</option>
                                        <option value="nostalgisch">Nostalgisch</option>
                                        <option value="informatief">Informatief</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">Lengte</label>
                                    <select
                                        value={data.ai_settings?.length}
                                        onChange={(e) => setData('ai_settings', { ...data.ai_settings, length: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="kort">Kort (2-3 alinea's)</option>
                                        <option value="medium">Medium (5-7 alinea's)</option>
                                        <option value="lang">Lang (10+ alinea's)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">Stijl</label>
                                    <select
                                        value={data.ai_settings?.style}
                                        onChange={(e) => setData('ai_settings', { ...data.ai_settings, style: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="verhaal">Verhaal</option>
                                        <option value="dagboek">Dagboek</option>
                                        <option value="blog">Blog Post</option>
                                        <option value="gids">Reisgids</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Chapters Card */}
                        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">📝</span>
                                    <h2 className="text-xl font-semibold text-white">Hoofdstukken</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={addChapter}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105"
                                >
                                    + Hoofdstuk
                                </button>
                            </div>

                            <div className="space-y-6">
                                {data.chapters.map((chapter, index) => (
                                    <div key={index} className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-white font-medium">Hoofdstuk {index + 1}</span>
                                            {data.chapters.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeChapter(index)}
                                                    className="text-red-400 hover:text-red-300 text-sm"
                                                >
                                                    ❌ Verwijderen
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Hoofdstuk Titel *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={chapter.title}
                                                    onChange={(e) => updateChapter(index, 'title', e.target.value)}
                                                    className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Notities / Content
                                                </label>
                                                <textarea
                                                    value={chapter.content}
                                                    onChange={(e) => updateChapter(index, 'content', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Korte notities over wat er gebeurde..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center">
                            <div className="flex gap-3">
                                {story.status !== 'generating' && data.chapters.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleGenerateStory}
                                        disabled={isGenerating || generationStatus === 'generating'}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-8 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {isGenerating || generationStatus === 'generating' ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                AI Werkt...
                                            </div>
                                        ) : generationStatus === 'success' ? (
                                            <div className="flex items-center gap-2">
                                                <span>✅</span>
                                                Opnieuw Genereren
                                            </div>
                                        ) : generationStatus === 'error' ? (
                                            <div className="flex items-center gap-2">
                                                <span>🔄</span>
                                                Probeer Opnieuw
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span>🤖</span>
                                                AI Verhaal Genereren
                                            </div>
                                        )}
                                    </button>
                                )}

                                <Link
                                    href={route('admin.stories.destroy', story.id)}
                                    method="delete"
                                    as="button"
                                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                    onBefore={() => confirm('Weet je zeker dat je deze story permanent wilt verwijderen? Deze actie kan niet ongedaan gemaakt worden.')}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>🗑️</span>
                                        Story Verwijderen
                                    </div>
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Bijwerken...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>💾</span>
                                        Story Bijwerken
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}