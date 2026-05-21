import AdminLayout from '@/Layouts/AdminLayout';
import ImageUpload from '@/Components/ImageUpload';
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

interface DierMetadata {
    wetenschappelijke_naam: string;
    sociaal_gedrag: string;
    voedsel: string;
    gewicht: string;
    lengte: string;
    nesttijd: string;
    zorgtijd: string;
    geslachtsrijp: string;
    leeftijd_wild: string;
    leefgebied: string;
    bedreigingsstatus: string;
    weetje_tekst: string;
}

interface PlekMetadata {
    extra_fotos: string[];
    weetje_tekst: string;
}

interface WeetjeMetadata {
    bron: string;
}

type DiscoveryMetadata = DierMetadata | PlekMetadata | WeetjeMetadata | Record<string, never>;

interface DiscoveryFormData {
    outing_id: number | '';
    venue_id: number | '';
    title: string;
    type: 'dier' | 'plek' | 'weetje' | '';
    description: string;
    image: string;
    metadata: DiscoveryMetadata;
}

const emptyDierMeta: DierMetadata = {
    wetenschappelijke_naam: '',
    sociaal_gedrag: '',
    voedsel: '',
    gewicht: '',
    lengte: '',
    nesttijd: '',
    zorgtijd: '',
    geslachtsrijp: '',
    leeftijd_wild: '',
    leefgebied: '',
    bedreigingsstatus: '',
    weetje_tekst: '',
};

const emptyPlekMeta: PlekMetadata = { extra_fotos: [''], weetje_tekst: '' };
const emptyWeetjeMeta: WeetjeMetadata = { bron: '' };

const bedreigingOptions = [
    { value: 'niet_bedreigd', label: 'Niet bedreigd' },
    { value: 'bijna_bedreigd', label: 'Bijna bedreigd' },
    { value: 'kwetsbaar', label: 'Kwetsbaar' },
    { value: 'bedreigd', label: 'Bedreigd' },
    { value: 'ernstig_bedreigd', label: 'Ernstig bedreigd' },
    { value: 'uitgestorven_wild', label: 'Uitgestorven in het wild' },
];

function initMetadata(type: string, existing: unknown): DiscoveryMetadata {
    if (existing && typeof existing === 'object') {
        if (type === 'dier') { return { ...emptyDierMeta, ...(existing as Partial<DierMetadata>) }; }
        if (type === 'plek') { return { ...emptyPlekMeta, ...(existing as Partial<PlekMetadata>) }; }
        if (type === 'weetje') { return { ...emptyWeetjeMeta, ...(existing as Partial<WeetjeMetadata>) }; }
    }
    if (type === 'dier') { return { ...emptyDierMeta }; }
    if (type === 'plek') { return { ...emptyPlekMeta }; }
    return { ...emptyWeetjeMeta };
}

export default function DiscoveryEdit({ discovery, outings, venues }: DiscoveryEditProps) {
    const discoveryAny = discovery as unknown as { venue_id?: number; metadata?: unknown };

    const { data, setData, patch, processing, errors } = useForm<DiscoveryFormData>({
        outing_id: discovery.outing_id ?? '',
        venue_id: discoveryAny.venue_id ?? '',
        title: discovery.title || '',
        type: discovery.type || '',
        description: discovery.description || '',
        image: discovery.image || '',
        metadata: initMetadata(discovery.type || '', discoveryAny.metadata),
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        patch(`/admin/discoveries/${discovery.id}`);
    };

    const handleTypeChange = (type: 'dier' | 'plek' | 'weetje') => {
        setData('type', type);
        if (type === 'dier') { setData('metadata', { ...emptyDierMeta }); }
        else if (type === 'plek') { setData('metadata', { ...emptyPlekMeta }); }
        else { setData('metadata', { ...emptyWeetjeMeta }); }
    };

    const setMeta = (key: string, value: unknown) => {
        setData('metadata', { ...data.metadata, [key]: value } as DiscoveryMetadata);
    };

    const dier = data.metadata as DierMetadata;
    const plek = data.metadata as PlekMetadata;
    const weetje = data.metadata as WeetjeMetadata;

    const inputClass = 'w-full bg-[#0d0f14] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition';
    const selectClass = 'w-full bg-[#0d0f14] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition';
    const labelClass = 'block text-sm font-medium text-gray-300 mb-2';

    return (
        <AdminLayout
            header={
                <div className="flex items-center space-x-3">
                    <Link href="/admin/discoveries" className="text-gray-400 hover:text-white transition">
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
                                <label className={labelClass}>Locatie (dierenpark, park, museum…)</label>
                                <select value={data.venue_id} onChange={(e) => setData('venue_id', Number(e.target.value) || '')} className={selectClass}>
                                    <option value="">Geen locatie</option>
                                    {venues.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Uitje <span className="text-gray-600 font-normal">(optioneel)</span></label>
                                <select value={data.outing_id} onChange={(e) => setData('outing_id', Number(e.target.value) || '')} className={selectClass}>
                                    <option value="">Geen uitje</option>
                                    {outings.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Basisinfo */}
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-5">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Basisinfo</h3>

                            <div>
                                <label className={labelClass}>Titel <span className="text-red-400">*</span></label>
                                <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="Naam van de ontdekking..." className={inputClass} />
                                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Type <span className="text-red-400">*</span></label>
                                <div className="flex gap-3">
                                    {(['dier', 'plek', 'weetje'] as const).map((type) => (
                                        <button key={type} type="button" onClick={() => handleTypeChange(type)}
                                            className={`flex-1 py-2.5 rounded-lg text-sm font-medium border capitalize transition ${data.type === type ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-[#0d0f14] border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                                            {type === 'dier' ? '🐾' : type === 'plek' ? '📍' : '💡'} {type}
                                        </button>
                                    ))}
                                </div>
                                {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Beschrijving <span className="text-red-400">*</span></label>
                                <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} placeholder="Korte beschrijving..." className={`${inputClass} resize-none`} />
                                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                            </div>

                            <div>
                                <ImageUpload
                                    value={data.image}
                                    onChange={(url) => setData('image', url)}
                                />
                            </div>
                        </div>

                        {/* === DIER VELDEN === */}
                        {data.type === 'dier' && (
                            <div className="bg-[#16181f] border border-emerald-900/40 rounded-xl p-6 space-y-5">
                                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">🐾 Dierinfo</h3>

                                <div>
                                    <label className={labelClass}>Wetenschappelijke naam</label>
                                    <input type="text" value={dier.wetenschappelijke_naam || ''} onChange={(e) => setMeta('wetenschappelijke_naam', e.target.value)} placeholder="bijv. Heloderma suspectum suspectum" className={inputClass} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Gewicht</label>
                                        <input type="text" value={dier.gewicht || ''} onChange={(e) => setMeta('gewicht', e.target.value)} placeholder="bijv. 0,5 - 2,2 kg" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Lengte</label>
                                        <input type="text" value={dier.lengte || ''} onChange={(e) => setMeta('lengte', e.target.value)} placeholder="bijv. 26-56 cm" className={inputClass} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Leefgebied</label>
                                        <input type="text" value={dier.leefgebied || ''} onChange={(e) => setMeta('leefgebied', e.target.value)} placeholder="bijv. Noord-Amerika" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Voedsel</label>
                                        <input type="text" value={dier.voedsel || ''} onChange={(e) => setMeta('voedsel', e.target.value)} placeholder="bijv. Insecten, kleine hagedissen" className={inputClass} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Sociaal gedrag</label>
                                        <select value={dier.sociaal_gedrag || ''} onChange={(e) => setMeta('sociaal_gedrag', e.target.value)} className={selectClass}>
                                            <option value="">Kies...</option>
                                            <option value="Solitair">Solitair</option>
                                            <option value="In paren">In paren</option>
                                            <option value="In groepen">In groepen</option>
                                            <option value="Kolonie">Kolonie</option>
                                            <option value="Familie">Familie</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Bedreigingsstatus</label>
                                        <select value={dier.bedreigingsstatus || ''} onChange={(e) => setMeta('bedreigingsstatus', e.target.value)} className={selectClass}>
                                            <option value="">Kies...</option>
                                            {bedreigingOptions.map((o) => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Nesttijd</label>
                                        <input type="text" value={dier.nesttijd || ''} onChange={(e) => setMeta('nesttijd', e.target.value)} placeholder="bijv. 10 mnd" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Zorgtijd</label>
                                        <input type="text" value={dier.zorgtijd || ''} onChange={(e) => setMeta('zorgtijd', e.target.value)} placeholder="bijv. GEEN of 3 mnd" className={inputClass} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Geslachtsrijp</label>
                                        <input type="text" value={dier.geslachtsrijp || ''} onChange={(e) => setMeta('geslachtsrijp', e.target.value)} placeholder="bijv. 3-5 jr" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Leeftijd in het wild</label>
                                        <input type="text" value={dier.leeftijd_wild || ''} onChange={(e) => setMeta('leeftijd_wild', e.target.value)} placeholder="bijv. max 20 jr" className={inputClass} />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>💡 Wist je dat…</label>
                                    <textarea value={dier.weetje_tekst || ''} onChange={(e) => setMeta('weetje_tekst', e.target.value)} rows={3} placeholder="Een leuk feit over dit dier..." className={`${inputClass} resize-none`} />
                                </div>
                            </div>
                        )}

                        {/* === PLEK VELDEN === */}
                        {data.type === 'plek' && (
                            <div className="bg-[#16181f] border border-blue-900/40 rounded-xl p-6 space-y-5">
                                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">📍 Plekinfo</h3>

                                <div>
                                    <label className={labelClass}>Extra foto's van deze plek</label>
                                    <div className="space-y-2">
                                        {(plek.extra_fotos || ['']).map((url, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    type="url"
                                                    value={url}
                                                    onChange={(e) => {
                                                        const fotos = [...(plek.extra_fotos || [''])];
                                                        fotos[i] = e.target.value;
                                                        setData('metadata', { ...data.metadata, extra_fotos: fotos } as DiscoveryMetadata);
                                                    }}
                                                    placeholder="https://..."
                                                    className={inputClass}
                                                />
                                                {i > 0 && (
                                                    <button type="button" onClick={() => {
                                                        const fotos = (plek.extra_fotos || ['']).filter((_, j) => j !== i);
                                                        setData('metadata', { ...data.metadata, extra_fotos: fotos } as DiscoveryMetadata);
                                                    }} className="px-3 py-2 text-red-400 hover:text-red-300 border border-gray-700 rounded-lg transition">✕</button>
                                                )}
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => {
                                            const fotos = [...(plek.extra_fotos || ['']), ''];
                                            setData('metadata', { ...data.metadata, extra_fotos: fotos } as DiscoveryMetadata);
                                        }} className="text-sm text-emerald-400 hover:text-emerald-300 transition">+ Foto toevoegen</button>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>💡 Wist je dat…</label>
                                    <textarea value={plek.weetje_tekst || ''} onChange={(e) => setMeta('weetje_tekst', e.target.value)} rows={3} placeholder="Een leuk feit over deze plek..." className={`${inputClass} resize-none`} />
                                </div>
                            </div>
                        )}

                        {/* === WEETJE VELDEN === */}
                        {data.type === 'weetje' && (
                            <div className="bg-[#16181f] border border-yellow-900/40 rounded-xl p-6 space-y-5">
                                <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">💡 Weetje details</h3>

                                <div>
                                    <label className={labelClass}>Bron</label>
                                    <input type="text" value={weetje.bron || ''} onChange={(e) => setMeta('bron', e.target.value)} placeholder="bijv. Wikipedia, naturalis.nl" className={inputClass} />
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <div className="flex items-center justify-end gap-4">
                            <Link href="/admin/discoveries" className="px-6 py-2.5 text-sm text-gray-400 hover:text-white transition">
                                Annuleren
                            </Link>
                            <button type="submit" disabled={processing}
                                className="px-6 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition shadow-lg hover:shadow-emerald-500/20">
                                {processing ? 'Opslaan...' : 'Wijzigingen Opslaan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
