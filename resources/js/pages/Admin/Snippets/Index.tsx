import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';

interface Snippet {
    id: number;
    platform: 'tiktok' | 'instagram' | 'facebook';
    hook_text: string;
    caption: string;
    published_at: string | null;
    outing?: { id: number; title: string };
}

interface SnippetsIndexProps {
    snippets: { data: Snippet[]; links: any[]; meta: any };
    filters: { search?: string };
}

const platformLabels: Record<string, { label: string; color: string; icon: string }> = {
    tiktok: { label: 'TikTok', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20', icon: '🎵' },
    instagram: { label: 'Instagram', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: '📸' },
    facebook: { label: 'Facebook', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: '👍' },
};

export default function SnippetsIndex({ snippets, filters }: SnippetsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
        router.get('/admin/snippets', { search: value }, { preserveState: true, replace: true });
    }, []);

    const handleDelete = (id: number) => {
        if (confirm('Weet je zeker dat je deze snippet wilt verwijderen?')) {
            router.delete(`/admin/snippets/${id}`);
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-lg font-semibold text-white">Social Snippets</h2>
                    <Link
                        href="/admin/snippets/create"
                        className="flex items-center space-x-2 p-2 sm:px-4 sm:py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition shadow-lg hover:shadow-emerald-500/20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden sm:inline">Nieuwe Snippet</span>
                    </Link>
                </div>
            }
        >
            <Head title="Social Snippets" />

            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6">
                        <div className="relative max-w-sm">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Zoek op platform of hook tekst..."
                                className="w-full pl-10 pr-4 py-2 bg-[#16181f] border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                            />
                        </div>
                    </div>

                    {snippets.data.length === 0 ? (
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-12 text-center">
                            <div className="text-5xl mb-4">📱</div>
                            <p className="text-gray-400 mb-6 text-lg">{search ? `Geen resultaten voor "${search}".` : 'Nog geen social snippets aangemaakt.'}</p>
                            {!search && (
                                <Link href="/admin/snippets/create" className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium">
                                    <span>Maak eerste snippet</span>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {snippets.data.map((snippet) => {
                                const platform = platformLabels[snippet.platform];
                                return (
                                    <div key={snippet.id} className="bg-[#16181f] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2.5 py-1 text-xs rounded border font-medium ${platform.color}`}>
                                                    {platform.icon} {platform.label}
                                                </span>
                                                {snippet.published_at && (
                                                    <span className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                                                        Gepubliceerd
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-white font-medium mb-2 line-clamp-2">{snippet.hook_text}</p>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{snippet.caption}</p>

                                        {snippet.outing && (
                                            <p className="text-xs text-gray-600 mb-3">→ {snippet.outing.title}</p>
                                        )}

                                        <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
                                            <Link
                                                href={`/admin/snippets/${snippet.id}/edit`}
                                                className="flex items-center gap-1 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded transition"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Bewerk
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(snippet.id)}
                                                className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded transition ml-auto"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Verwijder
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {snippets.meta?.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {snippets.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    className={`px-3 py-1.5 text-sm rounded-lg transition ${link.active ? 'bg-emerald-500 text-white' : link.url ? 'bg-[#16181f] border border-gray-700 text-gray-300 hover:border-emerald-500/50' : 'bg-[#16181f] border border-gray-800 text-gray-600 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
