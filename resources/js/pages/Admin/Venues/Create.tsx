import AdminLayout from '@/Layouts/AdminLayout';
import type { VenueType } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

interface Props {
    types: Record<string, VenueType>;
}

export default function VenuesCreate({ types }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: Object.keys(types)[0] ?? 'overig',
        description: '',
        city: '',
        country: 'Nederland',
        address: '',
        website: '',
        featured_image: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/venues');
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href="/admin/venues" className="text-gray-500 hover:text-gray-300 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h2 className="text-lg font-semibold text-white">Nieuwe Locatie</h2>
                </div>
            }
        >
            <Head title="Nieuwe Locatie" />

            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-2xl">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Naam *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                                    placeholder="bijv. Artis, Efteling, Pokémon Store"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Type *</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.entries(types).map(([key, t]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setData('type', key)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition ${
                                                data.type === key
                                                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                                                    : 'border-gray-700 bg-[#0f1117] text-gray-400 hover:border-gray-600'
                                            }`}
                                        >
                                            <span>{t.emoji}</span>
                                            <span>{t.label}</span>
                                        </button>
                                    ))}
                                </div>
                                {errors.type && <p className="mt-1 text-xs text-red-400">{errors.type}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Beschrijving</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition resize-none"
                                    placeholder="Beschrijf de locatie met belangrijke details voor bezoekers..."
                                />
                                <div className="mt-2 p-3 bg-emerald-900/20 border border-emerald-700/30 rounded-lg">
                                    <div className="flex items-start gap-2 mb-2">
                                        <span className="text-emerald-400 mt-0.5">💡</span>
                                        <div>
                                            <h4 className="text-sm font-medium text-emerald-300 mb-1">Local SEO Tips</h4>
                                            <p className="text-xs text-emerald-200/80 mb-2">Optimaliseer voor lokaal zoeken en Google My Business:</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-1 text-xs text-emerald-200/70 pl-6">
                                        <li>• <strong>Locatiespecifieke keywords:</strong> "Dierenpark Amsterdam", "Museum Utrecht"</li>
                                        <li>• <strong>Wat te doen:</strong> "geschikt voor kinderen", "interactieve experience"</li>
                                        <li>• <strong>Praktische info:</strong> "openingstijden", "parkeerplaats beschikbaar"</li>
                                        <li>• <strong>Unieke selling points:</strong> wat maakt deze plek bijzonder?</li>
                                        <li>• <strong>Toegankelijkheid:</strong> "rolstoeltoegankelijk", "openbaar vervoer"</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-5">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Locatiegegevens</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Stad</label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                                        placeholder="Amsterdam"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Land</label>
                                    <input
                                        type="text"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Adres</label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                                    placeholder="Plantage Kerklaan 38-40"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Website</label>
                                <input
                                    type="url"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                                    placeholder="https://www.artis.nl"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Afbeelding URL</label>
                                <input
                                    type="url"
                                    value={data.featured_image}
                                    onChange={(e) => setData('featured_image', e.target.value)}
                                    className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <Link
                                href="/admin/venues"
                                className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-200 transition"
                            >
                                Annuleren
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition"
                            >
                                {processing ? 'Opslaan...' : 'Locatie opslaan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
