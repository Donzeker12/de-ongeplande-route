import AdminLayout from '@/Layouts/AdminLayout';
import type { Venue, VenueType } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';

interface Props {
    venues: { data: Venue[]; links: any[]; meta: any };
    types: Record<string, VenueType>;
    filters: { search?: string; type?: string };
}

export default function VenuesIndex({ venues, types, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [typeFilter, setTypeFilter] = useState(filters.type ?? '');

    const applyFilters = useCallback((s: string, t: string) => {
        router.get('/admin/venues', { search: s || undefined, type: t || undefined }, { preserveState: true, replace: true });
    }, []);

    const handleSearch = (value: string) => {
        setSearch(value);
        applyFilters(value, typeFilter);
    };

    const handleType = (value: string) => {
        setTypeFilter(value);
        applyFilters(search, value);
    };

    const handleDelete = (venue: Venue) => {
        if (!confirm(`Weet je zeker dat je "${venue.name}" wilt verwijderen?`)) return;
        router.delete(`/admin/venues/${venue.id}`);
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-lg font-semibold text-white">Locaties & Plekken</h2>
                    <Link
                        href="/admin/venues/create"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nieuwe Locatie
                    </Link>
                </div>
            }
        >
            <Head title="Locaties" />

            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="flex flex-wrap gap-3">
                        <div className="relative flex-1 min-w-48">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Zoek op naam of stad..."
                                className="w-full pl-10 pr-4 py-2 bg-[#16181f] border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                            />
                        </div>
                        <select
                            value={typeFilter}
                            onChange={(e) => handleType(e.target.value)}
                            className="bg-[#16181f] border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500 transition"
                        >
                            <option value="">Alle types</option>
                            {Object.entries(types).map(([key, t]) => (
                                <option key={key} value={key}>{t.emoji} {t.label}</option>
                            ))}
                        </select>
                    </div>

                    {venues.data.length === 0 ? (
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-12 text-center">
                            <div className="text-5xl mb-4">📍</div>
                            <p className="text-gray-400 mb-6">
                                {search || typeFilter ? 'Geen locaties gevonden.' : 'Nog geen locaties toegevoegd.'}
                            </p>
                            {!search && !typeFilter && (
                                <Link href="/admin/venues/create" className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium">
                                    Eerste locatie toevoegen
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Naam</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stad / Land</th>
                                        <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Uitjes</th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50">
                                    {venues.data.map((venue) => (
                                        <tr key={venue.id} className="hover:bg-gray-800/20 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-200">{venue.name}</div>
                                                {venue.website && (
                                                    <a href={venue.website} target="_blank" rel="noreferrer" className="text-xs text-gray-600 hover:text-emerald-400 transition truncate block max-w-xs">
                                                        {venue.website}
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0f1117] border border-gray-700 rounded-lg text-xs text-gray-300">
                                                    {types[venue.type]?.emoji} {types[venue.type]?.label ?? venue.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                {[venue.city, venue.country].filter(Boolean).join(', ')}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-7 h-7 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full">
                                                    {venue.outings_count ?? 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/venues/${venue.id}/edit`}
                                                        className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(venue)}
                                                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
