import AdminLayout from '@/Layouts/AdminLayout';
import ImageUpload from '@/Components/ImageUpload';
import type { VenueType } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    types: Record<string, VenueType>;
}

interface DaySchedule {
    open: boolean;
    from: string;
    to: string;
}

interface PriceEntry {
    label: string;
    price: string;
}

interface TransportEntry {
    type: 'ov' | 'parkeren' | 'fiets' | 'auto' | 'overig';
    info: string;
}

interface FacilityEntry {
    name: string;
    available: 'ja' | 'nee' | 'onbekend';
}

interface PriceCategories {
    entree: PriceEntry[];
    abonnementen: PriceEntry[];
    groepen: PriceEntry[];
    parkeren: PriceEntry[];
    horeca: PriceEntry[];
    overig: PriceEntry[];
}

type PriceCategory = keyof PriceCategories;

interface FormData {
    name: string;
    type: string;
    description: string;
    opening_hours: Record<string, DaySchedule>;
    prices: PriceCategories;
    highlights: string;
    accessibility_transport: TransportEntry[];
    accessibility_facilities: FacilityEntry[];
    city: string;
    country: string;
    address: string;
    website: string;
    featured_image: string;
}

const DAYS = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'] as const;

const DAY_LABELS: Record<string, string> = {
    maandag: 'Maandag',
    dinsdag: 'Dinsdag',
    woensdag: 'Woensdag',
    donderdag: 'Donderdag',
    vrijdag: 'Vrijdag',
    zaterdag: 'Zaterdag',
    zondag: 'Zondag',
};

const PRICE_TABS: { key: PriceCategory; label: string; emoji: string }[] = [
    { key: 'entree', label: 'Entree', emoji: '🎟️' },
    { key: 'abonnementen', label: 'Abonnementen', emoji: '🎫' },
    { key: 'groepen', label: 'Groepen', emoji: '👨‍👩‍👧' },
    { key: 'parkeren', label: 'Parkeren', emoji: '🚗' },
    { key: 'horeca', label: 'Horeca', emoji: '🍽️' },
    { key: 'overig', label: 'Overig', emoji: '📦' },
];

const defaultOpeningHours: Record<string, DaySchedule> = {
    maandag: { open: true, from: '09:00', to: '17:00' },
    dinsdag: { open: true, from: '09:00', to: '17:00' },
    woensdag: { open: true, from: '09:00', to: '17:00' },
    donderdag: { open: true, from: '09:00', to: '17:00' },
    vrijdag: { open: true, from: '09:00', to: '17:00' },
    zaterdag: { open: true, from: '10:00', to: '17:00' },
    zondag: { open: false, from: '', to: '' },
};

const defaultPrices: PriceCategories = {
    entree: [
        { label: 'Volwassenen', price: '' },
        { label: 'Kinderen (3–12)', price: '' },
        { label: 'Senioren (65+)', price: '' },
        { label: 'Gratis (onder 3 jaar)', price: '0,00' },
    ],
    abonnementen: [],
    groepen: [],
    parkeren: [],
    horeca: [],
    overig: [],
};

const STEPS = [
    { id: 1, label: 'Basis' },
    { id: 2, label: 'Beschrijving' },
    { id: 3, label: 'Tijden' },
    { id: 4, label: 'Prijzen' },
    { id: 5, label: 'Extra' },
    { id: 6, label: 'Locatie' },
] as const;

export default function VenuesCreate({ types }: Props) {
    const [step, setStep] = useState(1);
    const [accessibilityTab, setAccessibilityTab] = useState<'transport' | 'facilities'>('transport');
    const [priceTab, setPriceTab] = useState<PriceCategory>('entree');

    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: '',
        type: Object.keys(types)[0] ?? 'overig',
        description: '',
        opening_hours: { ...defaultOpeningHours },
        prices: { ...defaultPrices },
        highlights: '',
        accessibility_transport: [],
        accessibility_facilities: [],
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

    const updateDay = (day: string, field: keyof DaySchedule, value: boolean | string) => {
        setData('opening_hours', {
            ...data.opening_hours,
            [day]: { ...data.opening_hours[day], [field]: value },
        });
    };

    const updatePrice = (category: PriceCategory, index: number, field: keyof PriceEntry, value: string) => {
        const updated = { ...data.prices };
        updated[category] = updated[category].map((entry, i) => (i === index ? { ...entry, [field]: value } : entry));
        setData('prices', updated);
    };

    const addPrice = (category: PriceCategory) => {
        const updated = { ...data.prices };
        updated[category] = [...updated[category], { label: '', price: '' }];
        setData('prices', updated);
    };

    const removePrice = (category: PriceCategory, index: number) => {
        const updated = { ...data.prices };
        updated[category] = updated[category].filter((_, i) => i !== index);
        setData('prices', updated);
    };

    const addTransport = () => {
        setData('accessibility_transport', [...data.accessibility_transport, { type: 'ov', info: '' }]);
    };
    const removeTransport = (index: number) => {
        setData('accessibility_transport', data.accessibility_transport.filter((_, i) => i !== index));
    };
    const updateTransport = (index: number, field: keyof TransportEntry, value: string) => {
        setData('accessibility_transport', data.accessibility_transport.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
    };

    const addFacility = (name = '') => {
        setData('accessibility_facilities', [...data.accessibility_facilities, { name, available: 'ja' }]);
    };
    const removeFacility = (index: number) => {
        setData('accessibility_facilities', data.accessibility_facilities.filter((_, i) => i !== index));
    };
    const updateFacility = (index: number, field: keyof FacilityEntry, value: string) => {
        setData('accessibility_facilities', data.accessibility_facilities.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
    };

    const inputClass =
        'w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition';
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

                    {/* Step indicator */}
                    <div className="flex items-start mb-8">
                        {STEPS.map((s, i) => (
                            <div key={s.id} className="flex items-center flex-1 last:flex-none">
                                <button
                                    type="button"
                                    onClick={() => setStep(s.id)}
                                    className="flex flex-col items-center gap-1.5 group"
                                >
                                    <span
                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition ${
                                            step === s.id
                                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                                                : step > s.id
                                                  ? 'border-emerald-700 bg-emerald-700/20 text-emerald-500'
                                                  : 'border-gray-700 bg-transparent text-gray-600'
                                        }`}
                                    >
                                        {step > s.id ? (
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2.5}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        ) : (
                                            s.id
                                        )}
                                    </span>
                                    <span
                                        className={`text-xs font-medium transition ${
                                            step === s.id
                                                ? 'text-emerald-400'
                                                : step > s.id
                                                  ? 'text-gray-500'
                                                  : 'text-gray-700'
                                        }`}
                                    >
                                        {s.label}
                                    </span>
                                </button>
                                {i < STEPS.length - 1 && (
                                    <div
                                        className={`flex-1 h-px mx-2 mb-5 transition ${step > s.id ? 'bg-emerald-700/50' : 'bg-gray-800'}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={submit} className="space-y-6">

                        {/* Stap 1: Basis */}
                        {step === 1 && (
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
                        )}

                        {/* Stap 2: Beschrijving */}
                        {step === 2 && (
                            <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6">
                                <label className={labelClass}>Beschrijving</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={10}
                                    className={textareaClass}
                                    placeholder="Beschrijf de locatie voor bezoekers..."
                                />
                            </div>
                        )}

                        {/* Stap 3: Openingstijden */}
                        {step === 3 && (
                            <div className="bg-[#16181f] border border-gray-800 rounded-xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-800">
                                    <h3 className="text-sm font-semibold text-gray-300">Openingstijden</h3>
                                </div>
                                <div className="divide-y divide-gray-800/50">
                                    {DAYS.map((day) => {
                                        const schedule = data.opening_hours[day];
                                        return (
                                            <div key={day} className="flex items-center gap-3 px-6 py-3">
                                                <span className="w-24 text-sm font-medium text-gray-300 shrink-0">
                                                    {DAY_LABELS[day]}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => updateDay(day, 'open', !schedule.open)}
                                                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition ${
                                                        schedule.open
                                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                            : 'bg-gray-800 text-gray-500 border border-gray-700'
                                                    }`}
                                                >
                                                    {schedule.open ? 'Open' : 'Gesloten'}
                                                </button>
                                                {schedule.open ? (
                                                    <div className="flex items-center gap-2 ml-auto">
                                                        <input
                                                            type="time"
                                                            value={schedule.from}
                                                            onChange={(e) => updateDay(day, 'from', e.target.value)}
                                                            className="bg-[#0f1117] border border-gray-700 rounded-lg px-3 py-1.5 text-gray-200 text-sm focus:outline-none focus:border-emerald-500 transition"
                                                        />
                                                        <span className="text-gray-600 text-sm shrink-0">tot</span>
                                                        <input
                                                            type="time"
                                                            value={schedule.to}
                                                            onChange={(e) => updateDay(day, 'to', e.target.value)}
                                                            className="bg-[#0f1117] border border-gray-700 rounded-lg px-3 py-1.5 text-gray-200 text-sm focus:outline-none focus:border-emerald-500 transition"
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="ml-auto text-sm text-gray-700">—</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Stap 4: Prijzen */}
                        {step === 4 && (
                            <div className="bg-[#16181f] border border-gray-800 rounded-xl overflow-hidden">
                                <div className="flex border-b border-gray-800 overflow-x-auto">
                                    {PRICE_TABS.map((tab) => (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            onClick={() => setPriceTab(tab.key)}
                                            className={`shrink-0 flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition ${
                                                priceTab === tab.key
                                                    ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5'
                                                    : 'text-gray-400 hover:text-gray-200'
                                            }`}
                                        >
                                            <span>{tab.emoji}</span>
                                            <span>{tab.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="p-6 space-y-3">
                                    {data.prices[priceTab].length > 0 && (
                                        <div className="grid grid-cols-[1fr_130px_32px] gap-2 mb-1">
                                            <span className="text-xs text-gray-500 font-medium">Omschrijving</span>
                                            <span className="text-xs text-gray-500 font-medium">Prijs</span>
                                            <span />
                                        </div>
                                    )}
                                    {data.prices[priceTab].map((entry, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-[1fr_130px_32px] gap-2 items-center"
                                        >
                                            <input
                                                type="text"
                                                value={entry.label}
                                                onChange={(e) =>
                                                    updatePrice(priceTab, index, 'label', e.target.value)
                                                }
                                                className="bg-[#0f1117] border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                                                placeholder="bijv. Volwassenen"
                                            />
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                                    €
                                                </span>
                                                <input
                                                    type="text"
                                                    value={entry.price}
                                                    onChange={(e) =>
                                                        updatePrice(priceTab, index, 'price', e.target.value)
                                                    }
                                                    className="w-full bg-[#0f1117] border border-gray-700 rounded-lg pl-7 pr-3 py-2 text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                                                    placeholder="0,00"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removePrice(priceTab, index)}
                                                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                    {data.prices[priceTab].length === 0 && (
                                        <p className="text-sm text-gray-600 text-center py-3">
                                            Nog geen prijzen toegevoegd voor dit tabblad
                                        </p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => addPrice(priceTab)}
                                        className="mt-1 flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                        Prijs toevoegen
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Stap 5: Extra */}
                        {step === 5 && (
                            <>
                                <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6">
                                    <label className={labelClass}>Wat maakt deze plek bijzonder?</label>
                                    <textarea
                                        value={data.highlights}
                                        onChange={(e) => setData('highlights', e.target.value)}
                                        rows={4}
                                        className={textareaClass}
                                        placeholder="Vertel wat deze locatie uniek maakt voor gezinnen of bezoekers..."
                                    />
                                </div>

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
                                    <div className="p-5 space-y-3">
                                        {accessibilityTab === 'transport' ? (
                                            <>
                                                {data.accessibility_transport.map((entry, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <select
                                                            value={entry.type}
                                                            onChange={(e) => updateTransport(i, 'type', e.target.value)}
                                                            className="bg-[#0f1117] border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-emerald-500 transition w-36 shrink-0"
                                                        >
                                                            <option value="ov">🚌 OV</option>
                                                            <option value="parkeren">🚗 Parkeren</option>
                                                            <option value="fiets">🚲 Fiets</option>
                                                            <option value="auto">🏎️ Auto</option>
                                                            <option value="overig">📍 Overig</option>
                                                        </select>
                                                        <input
                                                            type="text"
                                                            value={entry.info}
                                                            onChange={(e) => updateTransport(i, 'info', e.target.value)}
                                                            placeholder="Bijv. Tram 9 richting Diemen, halte Artis"
                                                            className="flex-1 bg-[#0f1117] border border-gray-700 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500 transition"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTransport(i)}
                                                            className="text-gray-600 hover:text-red-400 transition shrink-0"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={addTransport}
                                                    className="flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Optie toevoegen
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex flex-wrap gap-1.5 pb-1">
                                                    {['Rolstoeltoegankelijk', 'Kinderwagen', 'Lift aanwezig', 'Verschoontafel', 'Honden toegestaan', 'WC aanwezig', 'Gratis WiFi'].map((preset) => (
                                                        <button
                                                            key={preset}
                                                            type="button"
                                                            onClick={() => addFacility(preset)}
                                                            className="px-2.5 py-1 text-xs rounded-full bg-gray-800 text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-400 border border-gray-700 hover:border-emerald-600 transition"
                                                        >
                                                            + {preset}
                                                        </button>
                                                    ))}
                                                </div>
                                                {data.accessibility_facilities.map((entry, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={entry.name}
                                                            onChange={(e) => updateFacility(i, 'name', e.target.value)}
                                                            placeholder="Faciliteit"
                                                            className="flex-1 bg-[#0f1117] border border-gray-700 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-600 text-sm focus:outline-none focus:border-emerald-500 transition"
                                                        />
                                                        <select
                                                            value={entry.available}
                                                            onChange={(e) => updateFacility(i, 'available', e.target.value)}
                                                            className="bg-[#0f1117] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition w-32 shrink-0"
                                                            style={{ color: entry.available === 'ja' ? '#34d399' : entry.available === 'nee' ? '#f87171' : '#9ca3af' }}
                                                        >
                                                            <option value="ja">✓ Ja</option>
                                                            <option value="nee">✗ Nee</option>
                                                            <option value="onbekend">? Onbekend</option>
                                                        </select>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFacility(i)}
                                                            className="text-gray-600 hover:text-red-400 transition shrink-0"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => addFacility()}
                                                    className="flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Faciliteit toevoegen
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Stap 6: Locatie */}
                        {step === 6 && (
                            <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-5">
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
                                    <ImageUpload
                                        value={data.featured_image}
                                        onChange={(url) => setData('featured_image', url)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Navigatie */}
                        <div className="flex items-center justify-between pt-2">
                            <div>
                                {step > 1 ? (
                                    <button
                                        type="button"
                                        onClick={() => setStep(step - 1)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-200 transition"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                        Vorige
                                    </button>
                                ) : (
                                    <Link
                                        href="/admin/venues"
                                        className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-300 transition"
                                    >
                                        Annuleren
                                    </Link>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                {step > 1 && (
                                    <Link
                                        href="/admin/venues"
                                        className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-300 transition"
                                    >
                                        Annuleren
                                    </Link>
                                )}
                                {step < STEPS.length ? (
                                    <button
                                        type="button"
                                        onClick={() => setStep(step + 1)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition"
                                    >
                                        Volgende
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition"
                                    >
                                        {processing ? 'Opslaan...' : 'Locatie opslaan'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
