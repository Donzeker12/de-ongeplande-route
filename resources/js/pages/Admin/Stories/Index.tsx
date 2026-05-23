import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

interface Story {
    id: number;
    title: string;
    description: string;
    status: 'draft' | 'generating' | 'completed' | 'published';
    created_at: string;
    chapters_count: number;
}

interface Props {
    stories: {
        data: Story[];
        links: any[];
        meta: any;
    };
}

export default function StoriesIndex({ stories }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return <span className="px-2 py-1 bg-gray-600 text-gray-200 rounded-lg text-xs">📝 Concept</span>;
            case 'generating':
                return <span className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs">🤖 Genereren...</span>;
            case 'completed':
                return <span className="px-2 py-1 bg-green-600 text-white rounded-lg text-xs">✅ Voltooid</span>;
            case 'published':
                return <span className="px-2 py-1 bg-purple-600 text-white rounded-lg text-xs">🚀 Gepubliceerd</span>;
            default:
                return <span className="px-2 py-1 bg-gray-500 text-white rounded-lg text-xs">{status}</span>;
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-lg font-semibold text-white">Verhalen</h2>
                    <Link
                        href="/admin/stories/create"
                        className="flex items-center space-x-2 p-2 sm:px-4 sm:py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        <span className="hidden sm:inline">Nieuw Verhaal</span>
                    </Link>
                </div>
            }
        >
            <Head title="Verhalen" />

            <div className="p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">

                    {/* Verhalen Grid */}
                    {stories.data.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {stories.data.map((story) => (
                                <div
                                    key={story.id}
                                    className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700 hover:border-gray-600 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-white line-clamp-2">
                                            {story.title}
                                        </h3>
                                        {getStatusBadge(story.status)}
                                    </div>

                                    {story.description && (
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                            {story.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <span>{story.chapters_count || 0} hoofdstukken</span>
                                        <span>{new Date(story.created_at).toLocaleDateString('nl-NL')}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/stories/${story.id}/edit`}
                                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm text-center transition-colors"
                                        >
                                            ✏️ Bewerken
                                        </Link>
                                        {story.status === 'completed' && (
                                            <Link
                                                href={`/admin/stories/${story.id}`}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm text-center transition-colors"
                                            >
                                                👁️ Bekijken
                                            </Link>
                                        )}
                                        <Link
                                            href={route('admin.stories.destroy', story.id)}
                                            method="delete"
                                            as="button"
                                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                                            onBefore={() => confirm('Weet je zeker dat je deze story wilt verwijderen?')}
                                        >
                                            🗑️
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="text-center py-12">
                            <div className="mb-6">
                                <span className="text-8xl">📝</span>
                            </div>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                Nog geen verhalen gepubliceerd
                            </h2>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                Maak je eerste verhaal. Je kunt zelf schrijven of AI inschakelen om een verhaal te laten genereren op basis van hoofdstukken.
                            </p>
                            <Link
                                href="/admin/stories/create"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02]"
                            >
                                <span>✍️</span>
                                + Nieuw Verhaal
                            </Link>
                        </div>
                    )}

                    {/* Pagination would go here if needed */}
                </div>
            </div>
        </AdminLayout>
    );
}