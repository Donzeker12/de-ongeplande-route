import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

interface Chapter {
    title: string;
    content: string;
}

interface FormData {
    title: string;
    description: string;
    ai_settings: {
        tone: string;
        length: string;
        style: string;
    };
    chapters: Chapter[];
}

export default function CreateStory() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: '',
        description: '',
        ai_settings: {
            tone: 'vriendelijk',
            length: 'medium',
            style: 'verhaal'
        },
        chapters: [{ title: '', content: '' }]
    });

    const addChapter = () => {
        setData('chapters', [...data.chapters, { title: '', content: '' }]);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.stories.store'));
    };

    return (
        <AdminLayout>
            <Head title="Nieuwe Story Maken" />

            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-4xl">✍️</span>
                            <h1 className="text-3xl font-bold text-white">
                                AI Story Builder
                            </h1>
                        </div>
                        <p className="text-gray-300 text-lg">
                            Maak een nieuw verhaal met behulp van AI. Voeg hoofdstukken toe en laat Gemini Flash er een compleet verhaal van maken!
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
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
                                        placeholder="Bijv: Mijn geweldige dag in de Efteling"
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
                                        placeholder="Vertel AI hoe je het verhaal wilt hebben... Bijv: 'Schrijf een vrolijk verhaal over mijn avontuur in het pretpark'"
                                    />
                                    {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
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
                                        value={data.ai_settings.tone}
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
                                        value={data.ai_settings.length}
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
                                        value={data.ai_settings.style}
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
                                                    placeholder="Bijv: Aankomst bij de ingang"
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
                                                    placeholder="Korte notities over wat er gebeurde... AI maakt hier een volledig verhaal van!"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {errors.chapters && <p className="text-red-400 text-sm mt-2">{errors.chapters}</p>}
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Story Maken...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>🚀</span>
                                        Story Aanmaken
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