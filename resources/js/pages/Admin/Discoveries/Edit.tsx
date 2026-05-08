import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import type { Discovery } from '@/types';

interface Outing {
    id: number;
    title: string;
}

interface Venue {
    id: number;
    name: string;
}

interface DiscoveryEditProps {
    discovery: Discovery;
    outings: Outing[];
    venues: Venue[];
}

interface DiscoveryFormData {
    outing_id: number | '';
    venue_id: number | '';
    title: string;
    type: 'dier' | 'plek' | 'weetje' | '';
    description: string;
    image: string;
}

export default function DiscoveryEdit({ discovery, outings, venues }: DiscoveryEditProps) {
    const { data, setData, patch, processing, errors } = useForm<DiscoveryFormData>({
        outing_id: discovery.outing_id ?? '',
        venue_id: (discovery as unknown as { venue_id?: number }).venue_id ?? '',
        title: discovery.title || '',
        type: discovery.type || '',
        description: discovery.description || '',
        image: discovery.image || '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        patch(`/admin/discoveries/${discovery.id}`);
    };

    const selectClass = 'w-full bg-[#0d0f14] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition';

    return (
        <AdminLayout
            header={
                <div className="flex items-center space-x-3">
                    <Link
                        href="/admin/discoveries"
                        className="text-gray-400 hover:text-white transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h2 className="text-lg font-semibold text-white">Ontdekking Bewerken</h2>
                </div>
            }
        >
            <Head title={`Bewerk: ${discovery.title}`} />

            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Koppeling */}
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Koppel aan</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Locatie (dierenpark, park, museumâ€¦)
                                </label>
                                <select
                                    value={data.venue_id}
                                    onChange={(e) => setData('venue_id', Number(e.target.value) || '')}
                                    className={selectClass}
                                >
                                    <option value="">Geen locatie</option>
                                    {venues.map((v) => (
                                        <option key={v.id} value={v.id}>{v.name}</option>
                                    ))}
                                </select>
                                {errors.venue_id && <p className="text-red-400 text-sm mt-1">{errors.venue_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Uitje <span className="text-gray-600 font-normal">(optioneel)</span>
                                </label>
                                <select
                                    value={data.outing_id}
                                    onChange={(e) => setData('outing_id', Number(e.target.value) || '')}
                                    className={selectClass}
                                >
                                    <option value="">Geen uitje</option>
                                    {outings.map((outing) => (
                                        <option key={outing.id} value={outing.id}>{outing.title}</option>
                                    ))}
                                </select>
                                {errors.outing_id && <p className="text-red-400 text-sm mt-1">{errors.outing_id}</p>}
                            </div>
                        </div>

                        {/* Ontdekking details */}
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-5">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Details</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Titel <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Naam van de ontdekking..."
                                    className="w-full bg-[#0d0f14] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                                />
                                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Type <span className="text-red-400">*</span>
                                </label>
                                <div className="flex gap-3">
                                    {(['dier', 'plek', 'weetje'] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setData('type', type)}
                                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium border capitalize transition ${
                                                data.type === type
                                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                                    : 'bg-[#0d0f14] border-gray-700 text-gray-400 hover:border-gray-600'
                                            }`}
                                        >
                                            {type === 'dier' ? 'ðŸ¾' : type === 'plek' ? 'ðŸ“' : 'ðŸ’¡'} {type}
                                        </button>
                                    ))}
                                </div>
                                {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Beschrijving <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    placeholder="Vertel over de ontdekking..."
                                    className="w-full bg-[#0d0f14] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition resize-none"
                                />
                                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Afbeelding URL
                                </label>
                                <input
                                    type="url"
                                    value={data.image}
                                    onChange={(e) => setData('image', e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-[#0d0f14] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                                />
                                {data.image && (
                                    <div className="mt-3 rounded-lg overflow-hidden w-40 h-28 border border-gray-700">
                                        <img src={data.image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                {errors.image && <p className="text-red-400 text-sm mt-1">{errors.image}</p>}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-end gap-4">
                            <Link
                                href="/admin/discoveries"
                                className="px-6 py-2.5 text-sm text-gray-400 hover:text-white transition"
                            >
                                Annuleren
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition shadow-lg hover:shadow-emerald-500/20"
                            >
                                {processing ? 'Opslaan...' : 'Wijzigingen Opslaan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}


