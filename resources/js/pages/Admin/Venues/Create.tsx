import AdminLayout from '@/Layouts/AdminLayout';
import type { VenueType } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    types: Record<string, VenueType>;
}

export default function VenuesCreate({ types }: Props) {
    const [accessibilityTab, setAccessibilityTab] = useState<'transport' | 'facilities'>('transport');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: Object.keys(types)[0] ?? 'overig',
        description: '',
        opening_hours: '',
        prices: '',
        highlights: '',
        accessibility_transport: '',
        accessibility_facilities: '',
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

    const inputClass = 'w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition';
    const textareaClass = `${inputClass} resize-none`;
    const labelClass = 'block text-sm font-medium text-gray-300 mb-1.5';

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

                        {/* Naam + Type */}
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-5">
                            <div>
                                <label className={labelClass}>Naam *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={inputClass}
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
                        </div>

                        {/* Beschrijving */}
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6">
                            <label className={labelClass}>Beschrijving</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={5}
                                className={textareaClass}
                                placeholder="Beschrijf de locatie voor bezoekers. Denk aan sfeer, wat je kunt doen en voor wie het geschikt is..."
                            />
                            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
                        </div>

                        {/* Tijden */}
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6">
                            <label className={labelClass}>Openingstijden</label>
                            <textarea
                                value={data.opening_hours}
                                onChange={(e) => setData('opening_hours', e.target.value)}
                                rows={4}
                                className={textareaClass}
                                placeholder={'Ma – Vr: 9:00 – 17:00\nZa – Zo: 10:00 – 18:00\nFeestdagen: gesloten'}
                            />
                            {errors.opening_hours && <p className="mt-1 text-xs text-red-400">{errors.opening_hours}</p>}
                        </div>

                        {/* Prijzen */}
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6">
                            <label className={labelClass}>Prijzen</label>
                            <textarea
                                value={data.prices}
                                onChange={(e) => setData('prices', e.target.value)}
                                rows={4}
                                className={textareaClass}
                                placeholder={'Volwassenen: €15,00\nKinderen (3–12): €10,00\nGratis onder 3 jaar'}
                            />
                            {errors.prices && <p className="mt-1 text-xs text-red-400">{errors.prices}</p>}
                        </div>

                        {/* Wat maakt deze plek bijzonder */}
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6">
                            <label className={labelClass}>Wat maakt deze plek bijzonder?</label>
                            <textarea
                                value={data.highlights}
                                onChange={(e) => setData('highlights', e.target.value)}
                                rows={4}
                                className={textareaClass}
                                placeholder="Vertel wat deze locatie uniek maakt voor gezinnen of bezoekers..."
                            />
                            {errors.highlights && <p className="mt-1 text-xs text-red-400">{errors.highlights}</p>}
                        </div>

                        {/* Toegankelijkheid (tabs) */}
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl overflow-hidden">
                            <div className="flex border-b border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setAccessibilityTab('transport')}
                                    className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                                        accessibilityTab === 'transport'
                                            ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5'
                                            : 'text-gray-400 hover:text-gray-200'
                                    }`}
                                >
                                    🚌 Bereikbaarheid
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAccessibilityTab('facilities')}
                                    className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                                        accessibilityTab === 'facilities'
                                            ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5'
                                            : 'text-gray-400 hover:text-gray-200'
                                    }`}
                                >
                                    ♿ Faciliteiten
                                </button>
                            </div>
                            <div className="p-6">
                                {accessibilityTab === 'transport' ? (
                                    <div>
                                        <label className={labelClass}>Bereikbaarheid</label>
                                        <textarea
                                            value={data.accessibility_transport}
                                            onChange={(e) => setData('accessibility_transport', e.target.value)}
                                            rows={4}
                                            className={textareaClass}
                                            placeholder={'OV: Tram 9 richting Diemen, halte Artis\nParkeren: P+R IJburg, €5 per dag\nFiets: fietsstalling aanwezig bij de ingang'}
                                        />
                                        {errors.accessibility_transport && <p className="mt-1 text-xs text-red-400">{errors.accessibility_transport}</p>}
                                    </div>
                                ) : (
                                    <div>
                                        <label className={labelClass}>Faciliteiten & toegankelijkheid</label>
                                        <textarea
                                            value={data.accessibility_facilities}
                                            onChange={(e) => setData('accessibility_facilities', e.target.value)}
                                            rows={4}
                                            className={textareaClass}
                                            placeholder={'Rolstoeltoegankelijk: ja\nKinderwagen: ja\nLift aanwezig: nee\nVerschoontafel: ja\nHonden: niet toegestaan'}
                                        />
                                        {errors.accessibility_facilities && <p className="mt-1 text-xs text-red-400">{errors.accessibility_facilities}</p>}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Locatiegegevens */}
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-5">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Locatiegegevens</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Stad</label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className={inputClass}
                                        placeholder="Amsterdam"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Land</label>
                                    <input
                                        type="text"
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Adres</label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className={inputClass}
                                    placeholder="Plantage Kerklaan 38-40"
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Website</label>
                                <input
                                    type="url"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    className={inputClass}
                                    placeholder="https://www.artis.nl"
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Afbeelding URL</label>
                                <input
                                    type="url"
                                    value={data.featured_image}
                                    onChange={(e) => setData('featured_image', e.target.value)}
                                    className={inputClass}
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
