import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import type { Discovery } from '@/types';

interface DiscoveriesIndexProps {
    discoveries: {
        data: Discovery[];
        links: any[];
        meta: any;
    };
    filters: { search?: string };
}

const typeLabels: Record<string, { label: string; color: string }> = {
    dier: { label: '🐾 Dier', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    plek: { label: '📍 Plek', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    weetje: { label: '💡 Weetje', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
};

export default function DiscoveriesIndex({ discoveries, filters }: DiscoveriesIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
        router.get('/admin/discoveries', { search: value }, { preserveState: true, replace: true });
    }, []);

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Weet je zeker dat je "${title}" wilt verwijderen?`)) {
            router.delete(`/admin/discoveries/${id}`);
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-lg font-semibold text-white">
                        Ontdekkingen Beheren
                    </h2>
                    <Link
                        href="/admin/discoveries/create"
                        className="flex items-center space-x-2 p-2 sm:px-4 sm:py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition shadow-lg hover:shadow-emerald-500/20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden sm:inline">Nieuwe Ontdekking</span>
                    </Link>
                </div>
            }
        >
            <Head title="Ontdekkingen Beheren" />

            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    {/* Search bar */}
                    <div className="mb-6">
                        <div className="relative max-w-sm">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Zoek op naam, type of uitje..."
                                className="w-full pl-10 pr-4 py-2 bg-[#16181f] border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                            />
                        </div>
                    </div>

                    {discoveries.data.length === 0 ? (
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-12 text-center">
                            <div className="text-5xl mb-4">✨</div>
                            <p className="text-gray-400 mb-6 text-lg">{search ? `Geen resultaten voor "${search}".` : 'Nog geen ontdekkingen toegevoegd.'}</p>
                            {!search && (
                                <Link
                                    href="/admin/discoveries/create"
                                    className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shadow-lg hover:shadow-emerald-500/20 font-medium"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Maak je eerste ontdekking</span>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {discoveries.data.map((discovery) => (
                                <div key={discovery.id} className="bg-[#16181f] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition group">
                                    <div className="flex flex-col sm:flex-row">
                                        {/* Image */}
                                        {discovery.image && (
                                            <div className="flex-shrink-0 w-full h-36 sm:w-32 sm:h-auto">
                                                <img
                                                    src={discovery.image}
                                                    alt={discovery.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="flex-1 p-4 sm:p-5 flex flex-col">
                                            <div className="flex-1 mb-3">
                                                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-emerald-400 transition">
                                                    {discovery.title}
                                                </h3>

                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {discovery.type && typeLabels[discovery.type] && (
                                                        <span className={`px-2 py-0.5 text-xs rounded border ${typeLabels[discovery.type].color}`}>
                                                            {typeLabels[discovery.type].label}
                                                        </span>
                                                    )}
                                                </div>

                                                {discovery.outing && (
                                                    <div className="flex items-center space-x-1.5 text-xs text-gray-400">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                        </svg>
                                                        <span>{discovery.outing.title}</span>
                                                    </div>
                                                )}

                                                {discovery.description && (
                                                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{discovery.description}</p>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center space-x-2 pt-3 border-t border-gray-800">
                                                <Link
                                                    href={`/admin/discoveries/${discovery.id}/edit`}
                                                    className="flex items-center space-x-1 px-3 py-1.5 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded transition"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    <span>Bewerk</span>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(discovery.id, discovery.title)}
                                                    className="flex items-center space-x-1 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition ml-auto"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    <span>Verwijder</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {discoveries.meta && discoveries.meta.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {discoveries.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    className={`px-3 py-1.5 text-sm rounded-lg transition ${
                                        link.active
                                            ? 'bg-emerald-500 text-white'
                                            : link.url
                                                ? 'bg-[#16181f] border border-gray-700 text-gray-300 hover:border-emerald-500/50'
                                                : 'bg-[#16181f] border border-gray-800 text-gray-600 cursor-not-allowed'
                                    }`}
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
