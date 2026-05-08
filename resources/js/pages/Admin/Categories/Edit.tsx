import AdminLayout from '@/Layouts/AdminLayout';
import type { Category } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const EMOJI_SUGGESTIONS = ['📍', '🦁', '🎡', '🛍️', '🏛️', '🌳', '🍽️', '🎟️', '🌿', '⭐', '🔥', '❤️', '🚀', '🐾', '🌸'];

interface Props {
    category: Category;
}

export default function CategoryEdit({ category }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        name: category.name,
        slug: category.slug,
        emoji: category.emoji,
        description: category.description ?? '',
        sort_order: category.sort_order,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        patch(`/admin/categories/${category.id}`);
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-lg font-semibold text-white">{category.name} bewerken</h2>
                    <Link href="/admin/categories" className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition text-sm">
                        ← Terug
                    </Link>
                </div>
            }
        >
            <Head title={`${category.name} bewerken`} />

            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-2xl">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-5">

                            <div className="flex gap-4">
                                <div className="shrink-0">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Emoji</label>
                                    <div className="w-16 h-16 bg-[#0f1117] border border-gray-700 rounded-xl flex items-center justify-center text-3xl">
                                        {data.emoji}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Naam *</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Kies een emoji</label>
                                <div className="flex flex-wrap gap-2">
                                    {EMOJI_SUGGESTIONS.map((e) => (
                                        <button
                                            key={e}
                                            type="button"
                                            onClick={() => setData('emoji', e)}
                                            className={`w-10 h-10 rounded-lg text-xl transition ${data.emoji === e ? 'bg-emerald-500/20 border border-emerald-500' : 'bg-[#0f1117] border border-gray-700 hover:border-gray-500'}`}
                                        >
                                            {e}
                                        </button>
                                    ))}
                                    <input
                                        type="text"
                                        value={data.emoji}
                                        onChange={(e) => setData('emoji', e.target.value)}
                                        maxLength={2}
                                        className="w-20 bg-[#0f1117] border border-gray-700 rounded-lg px-3 text-gray-200 text-center focus:border-emerald-500 transition text-sm"
                                        placeholder="eigen"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Beschrijving</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:border-emerald-500 transition font-mono text-sm"
                                    />
                                    {errors.slug && <p className="mt-1 text-sm text-red-400">{errors.slug}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Volgorde</label>
                                    <input
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', Number(e.target.value))}
                                        min={0}
                                        className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:border-emerald-500 transition"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition disabled:opacity-50 font-medium"
                                >
                                    {processing ? 'Bezig...' : 'Opslaan'}
                                </button>
                                <Link href="/admin/categories" className="px-4 py-2.5 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition text-sm">
                                    Annuleren
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
