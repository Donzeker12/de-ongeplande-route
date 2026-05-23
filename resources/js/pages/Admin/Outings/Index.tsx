import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import type { Outing } from '@/types';

function formatDate(dateStr?: string | null): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface OutingsIndexProps {
    outings: {
        data: Outing[];
        links: any[];
        meta: any;
    };
    filters: { search?: string };
}

export default function OutingsIndex({ outings, filters }: OutingsIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
        router.get('/admin/outings', { search: value }, { preserveState: true, replace: true });
    }, []);

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Weet je zeker dat je "${title}" wilt verwijderen?`)) {
            router.delete(`/admin/outings/${id}`);
        }
    };

    const handleTogglePublished = (id: number) => {
        router.patch(`/admin/outings/${id}/toggle-published`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-lg font-semibold text-white">
                        Uitjes Beheren
                    </h2>
                    <Link
                        href="/admin/outings/create"
                        className="flex items-center space-x-2 p-2 sm:px-4 sm:py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition shadow-lg hover:shadow-emerald-500/20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden sm:inline">Nieuw Uitje</span>
                    </Link>
                </div>
            }
        >
            <Head title="Uitjes Beheren" />

            <div className="p-6 lg:p-8">
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
                                placeholder="Zoek op titel, stad of categorie..."
                                className="w-full pl-10 pr-4 py-2 bg-[#16181f] border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                            />
                        </div>
                    </div>

                    {outings.data.length === 0 ? (
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-12 text-center">
                            <div className="text-5xl mb-4">📖</div>
                            <p className="text-gray-400 mb-6 text-lg">{search ? `Geen resultaten voor "${search}".` : 'Nog geen uitjes toegevoegd.'}</p>
                            {!search && (
                                <Link
                                    href="/admin/outings/create"
                                    className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shadow-lg hover:shadow-emerald-500/20 font-medium"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Maak je eerste uitje</span>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {outings.data.map((outing) => (
                                <div key={outing.id} className="bg-[#16181f] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition group">
                                    <div className="flex">
                                        {/* Image */}
                                        {outing.featured_image && (
                                            <div className="flex-shrink-0 w-28 sm:w-36 self-stretch">
                                                <img
                                                    src={outing.featured_image}
                                                    alt={outing.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        
                                        <div className="flex-1 p-5 flex flex-col">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-emerald-400 transition truncate">
                                                            {outing.title}
                                                        </h3>
                                                        <span className={`shrink-0 px-2 py-0.5 text-xs rounded border ${outing.published_at ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-700/50 text-gray-500 border-gray-700'}`}>
                                                            {outing.published_at ? 'Gepubliceerd' : 'Concept'}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {outing.is_recommended && (
                                                            <span className="px-2 py-0.5 text-xs bg-amber-500/10 text-amber-400 rounded border border-amber-500/20">
                                                                ⭐ Aanbevolen
                                                            </span>
                                                        )}
                                                        {outing.category && (
                                                            <span className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
                                                                {outing.category}
                                                            </span>
                                                        )}
                                                        {outing.is_free && (
                                                            <span className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
                                                                Gratis
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5 text-xs text-gray-400 mb-4">
                                                {outing.city && (
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span>{outing.city}</span>
                                                    </div>
                                                )}
                                                {outing.visit_date && (
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>{formatDate(outing.visit_date)}</span>
                                                    </div>
                                                )}
                                                {outing.discoveries && outing.discoveries.length > 0 && (
                                                    <div className="flex items-center space-x-2">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                        </svg>
                                                        <span>{outing.discoveries.length} ontdekking{outing.discoveries.length !== 1 ? 'en' : ''}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1 mt-auto pt-3 border-t border-gray-800">
                                                <button
                                                    onClick={() => handleTogglePublished(outing.id)}
                                                    className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs rounded transition ${
                                                        outing.published_at
                                                            ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10'
                                                            : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                                                    }`}
                                                    title={outing.published_at ? 'Depubliceren' : 'Publiceren'}
                                                >
                                                    <span>{outing.published_at ? '⏸' : '▶'}</span>
                                                    <span className="hidden sm:inline">{outing.published_at ? 'Depubliceer' : 'Publiceer'}</span>
                                                </button>
                                                <Link
                                                    href={`/uitjes/${outing.slug}`}
                                                    target="_blank"
                                                    className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition"
                                                    title="Bekijk op website"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    <span className="hidden sm:inline">Bekijk</span>
                                                </Link>
                                                <Link
                                                    href={`/admin/outings/${outing.id}/edit`}
                                                    className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded transition"
                                                    title="Bewerken"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    <span className="hidden sm:inline">Bewerk</span>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(outing.id, outing.title)}
                                                    className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition ml-auto"
                                                    title="Verwijderen"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    <span className="hidden sm:inline">Verwijder</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
