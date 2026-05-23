import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

interface Story {
    id: number;
    title: string;
    slug: string;
    description: string;
    featured_image: string | null;
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
                                    className="bg-[#16181f] rounded-2xl overflow-hidden shadow-2xl border border-gray-800 hover:border-gray-700 transition-all group"
                                >
                                    {/* Featured image */}
                                    {story.featured_image ? (
                                        <a href={`/verhalen/${story.slug}`} target="_blank" rel="noopener noreferrer" className="block overflow-hidden aspect-video">
                                            <img
                                                src={story.featured_image}
                                                alt={story.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </a>
                                    ) : (
                                        <a href={`/verhalen/${story.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center aspect-video bg-gray-800 text-gray-600 hover:text-gray-500 transition">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                            </svg>
                                        </a>
                                    )}

                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="text-base font-semibold text-white line-clamp-2 group-hover:text-purple-400 transition">
                                                {story.title}
                                            </h3>
                                            {getStatusBadge(story.status)}
                                        </div>

                                        {story.description && (
                                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                                {story.description}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                            <span>{story.chapters_count || 0} hoofdstukken</span>
                                            <span>{new Date(story.created_at).toLocaleDateString('nl-NL')}</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 pt-3 border-t border-gray-800">
                                            <Link
                                                href={`/admin/stories/${story.id}/edit`}
                                                className="flex items-center gap-1 px-3 py-1.5 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded transition"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Bewerken
                                            </Link>
                                            <a
                                                href={`/verhalen/${story.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 px-3 py-1.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Bekijk
                                            </a>
                                            <Link
                                                href={route('admin.stories.destroy', story.id)}
                                                method="delete"
                                                as="button"
                                                className="ml-auto flex items-center gap-1 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition"
                                                onBefore={() => confirm('Weet je zeker dat je dit verhaal wilt verwijderen?')}
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Verwijder
                                            </Link>
                                        </div>
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