import AdminLayout from '@/Layouts/AdminLayout';
import type { Category } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';

interface Props {
    categories: { data: Category[]; links: any[]; meta: any };
    filters: { search?: string };
}

export default function CategoriesIndex({ categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
        router.get('/admin/categories', { search: value }, { preserveState: true, replace: true });
    }, []);

    const handleDelete = (category: Category) => {
        if (!confirm(`Weet je zeker dat je "${category.name}" wilt verwijderen?`)) return;
        router.delete(`/admin/categories/${category.id}`);
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-lg font-semibold text-white">Categorieën</h2>
                    <Link
                        href="/admin/categories/create"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nieuwe Categorie
                    </Link>
                </div>
            }
        >
            <Head title="Categorieën" />

            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-4xl space-y-6">
                    <div className="relative max-w-sm">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Zoek categorie..."
                            className="w-full pl-10 pr-4 py-2 bg-[#16181f] border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                        />
                    </div>

                    {categories.data.length === 0 ? (
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-12 text-center">
                            <div className="text-5xl mb-4">🏷️</div>
                            <p className="text-gray-400 mb-6">Nog geen categorieën aangemaakt.</p>
                            <Link href="/admin/categories/create" className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium">
                                Eerste categorie aanmaken
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categorie</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                                        <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Uitjes</th>
                                        <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Volgorde</th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/50">
                                    {categories.data.map((cat) => (
                                        <tr key={cat.id} className="hover:bg-gray-800/20 transition">
                                            <td className="px-6 py-4">
                                                <span className="flex items-center gap-3">
                                                    <span className="text-2xl">{cat.emoji}</span>
                                                    <span className="font-medium text-gray-200">{cat.name}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 font-mono">{cat.slug}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-7 h-7 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full">
                                                    {cat.outings_count ?? 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-500">{cat.sort_order}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/categories/${cat.id}/edit`}
                                                        className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(cat)}
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
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
