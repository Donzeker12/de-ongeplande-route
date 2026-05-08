import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Navigation from '@/Components/Navigation';
import type { Discovery, DierMetadata, Outing, Venue } from '@/types';

interface Props {
    discovery: Discovery & {
        outing: Outing | null;
    };
    outing: Outing | null;
    venue: Venue | null;
}

// Per type: accent kleur, emoji, label
const typeConfig: Record<string, { label: string; emoji: string; bg: string; text: string; border: string; heroBg: string }> = {
    dier:   { label: 'Dier',   emoji: '\uD83E\uDD8E', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-400', heroBg: 'from-emerald-900/70' },
    plek:   { label: 'Plek',   emoji: '\uD83D\uDCCD', bg: 'bg-sky-100',     text: 'text-sky-700',     border: 'border-sky-400',     heroBg: 'from-sky-900/70' },
    weetje: { label: 'Weetje', emoji: '\uD83D\uDCA1', bg: 'bg-violet-100',  text: 'text-violet-700',  border: 'border-violet-400',  heroBg: 'from-violet-900/70' },
};

export default function DiscoveryShow({ discovery, outing, venue }: Props) {
    const [lightboxOpen, setLightboxOpen] = useState(false);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightboxOpen(false);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('nl-NL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const tc = typeConfig[discovery.type] ?? typeConfig['weetje'];

    return (
        <>
            <Head title={`${discovery.title} - De Ongeplande Route`} />

            <div className="min-h-screen bg-warm-bg">
                <Navigation />

                {/* Hero: afbeelding met gradient + titel overlay */}
                {discovery.image ? (
                    <div className="relative h-72 sm:h-96 md:h-[28rem] w-full overflow-hidden">
                        <img
                            src={discovery.image}
                            alt={discovery.title}
                            className="w-full h-full object-cover"
                        />
                        {/* gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${tc.heroBg} via-black/30 to-transparent`} />

                        {/* breadcrumb bovenin */}
                        <div className="absolute top-4 left-0 right-0 px-6">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex items-center gap-2 text-sm text-white/80">
                                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                                    {outing && (
                                        <>
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                            <Link href={`/uitjes/${outing.slug}`} className="hover:text-white transition-colors">{outing.title}</Link>
                                        </>
                                    )}
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                    <span className="text-white font-medium">{discovery.title}</span>
                                </div>
                            </div>
                        </div>

                        {/* titel onderaan hero */}
                        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
                            <div className="max-w-7xl mx-auto">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${tc.bg} ${tc.text} text-sm font-semibold rounded-full mb-3`}>
                                    {tc.emoji} {tc.label}
                                </span>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white drop-shadow-md">
                                    {discovery.title}
                                </h1>
                                {outing && (
                                    <p className="text-white/80 mt-2 text-sm">
                                        Ontdekt tijdens:{' '}
                                        <Link href={`/uitjes/${outing.slug}`} className="text-white underline underline-offset-2 hover:no-underline">
                                            {outing.title}
                                        </Link>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* vergroot knop */}
                        <button
                            onClick={() => setLightboxOpen(true)}
                            className="absolute bottom-4 right-6 bg-black/50 hover:bg-black/70 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm transition"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                            Vergroot
                        </button>
                    </div>
                ) : (
                    /* Geen afbeelding: gewone breadcrumb balk */
                    <div className="bg-gradient-to-r from-warm-800 via-warm-700 to-warm-600 py-12 px-6">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
                                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                <span className="text-white">{discovery.title}</span>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${tc.bg} ${tc.text} text-sm font-semibold rounded-full mb-3`}>
                                {tc.emoji} {tc.label}
                            </span>
                            <h1 className="text-4xl font-serif text-white">{discovery.title}</h1>
                        </div>
                    </div>
                )}

                {/* Lightbox */}
                {lightboxOpen && discovery.image && createPortal(
                    <div
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/40 rounded-full p-2 transition"
                            onClick={() => setLightboxOpen(false)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img
                            src={discovery.image}
                            alt={discovery.title}
                            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        />
                    </div>,
                    document.body
                )}

                {/* Page content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Main content */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Beschrijving */}
                            <div className="bg-white rounded-2xl shadow-soft p-8">
                                <div className={`flex items-center gap-2 mb-5 pb-4 border-b-2 ${tc.border}`}>
                                    <span className="text-2xl">{tc.emoji}</span>
                                    <h2 className="font-serif text-xl text-warm-700">Over deze ontdekking</h2>
                                </div>
                                <p className="text-lg text-warm-600 leading-relaxed">
                                    {discovery.description}
                                </p>
                            </div>

                            {/* Metadata: Dier */}
                            {discovery.type === 'dier' && discovery.metadata && (() => {
                                const m = discovery.metadata as DierMetadata;
                                const bedreigingLabels: Record<string, string> = {
                                    niet_bedreigd: 'Niet bedreigd',
                                    bijna_bedreigd: 'Bijna bedreigd',
                                    kwetsbaar: 'Kwetsbaar',
                                    bedreigd: 'Bedreigd',
                                    ernstig_bedreigd: 'Ernstig bedreigd',
                                    uitgestorven_wild: 'Uitgestorven in het wild',
                                };
                                const bedreigingColors: Record<string, string> = {
                                    niet_bedreigd: 'bg-green-100 text-green-700',
                                    bijna_bedreigd: 'bg-lime-100 text-lime-700',
                                    kwetsbaar: 'bg-yellow-100 text-yellow-700',
                                    bedreigd: 'bg-orange-100 text-orange-700',
                                    ernstig_bedreigd: 'bg-red-100 text-red-700',
                                    uitgestorven_wild: 'bg-gray-100 text-gray-700',
                                };
                                const facts = [
                                    { label: 'Wetenschappelijke naam', value: m.wetenschappelijke_naam, italic: true },
                                    { label: 'Voedsel',               value: m.voedsel },
                                    { label: 'Gewicht',               value: m.gewicht },
                                    { label: 'Lengte',                value: m.lengte },
                                    { label: 'Leefgebied',            value: m.leefgebied },
                                    { label: 'Nesttijd',              value: m.nesttijd },
                                    { label: 'Zorgtijd',              value: m.zorgtijd },
                                    { label: 'Geslachtsrijp',         value: m.geslachtsrijp },
                                    { label: 'Leeftijd (wild)',       value: m.leeftijd_wild },
                                    { label: 'Sociaal gedrag',        value: m.sociaal_gedrag },
                                ].filter(f => f.value);

                                return (
                                    <>
                                        {(facts.length > 0 || m.bedreigingsstatus) && (
                                            <div className="bg-white rounded-2xl shadow-soft p-8">
                                                <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-emerald-400">
                                                    <span className="text-2xl">&#x1F4CB;</span>
                                                    <h2 className="font-serif text-xl text-warm-700">Feiten</h2>
                                                </div>

                                                {m.bedreigingsstatus && (
                                                    <div className="mb-5">
                                                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${bedreigingColors[m.bedreigingsstatus] ?? 'bg-gray-100 text-gray-700'}`}>
                                                            <span className="w-2 h-2 rounded-full bg-current opacity-70 inline-block" />
                                                            {bedreigingLabels[m.bedreigingsstatus] ?? m.bedreigingsstatus}
                                                        </span>
                                                    </div>
                                                )}

                                                {facts.length > 0 && (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {facts.map(({ label, value, italic }) => (
                                                            <div key={label} className="flex flex-col px-4 py-3 bg-emerald-50 border-l-4 border-emerald-300 rounded-r-lg">
                                                                <span className="text-xs text-emerald-600 uppercase tracking-wide font-semibold">{label}</span>
                                                                <span className={`text-warm-700 font-medium mt-0.5 ${italic ? 'italic' : ''}`}>{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {m.weetje_tekst && (
                                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-soft">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center shrink-0 shadow-md">
                                                        <span className="text-lg">&#x1F4A1;</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">Wist je dat...</p>
                                                        <p className="text-warm-700 leading-relaxed text-base">{m.weetje_tekst}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}

                            {/* Metadata: Plek */}
                            {discovery.type === 'plek' && discovery.metadata?.weetje_tekst && (
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-soft">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center shrink-0 shadow-md">
                                            <span className="text-lg">&#x1F4A1;</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">Wist je dat...</p>
                                            <p className="text-warm-700 leading-relaxed text-base">{discovery.metadata.weetje_tekst}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Metadata: Weetje (bron) */}
                            {discovery.type === 'weetje' && discovery.metadata?.bron && (
                                <div className="bg-white rounded-2xl shadow-soft p-5 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center shrink-0">
                                        <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-warm-600">Bron: <span className="text-warm-700 font-semibold">{discovery.metadata.bron}</span></span>
                                </div>
                            )}

                            {/* Gerelateerd uitje */}
                            {outing && (
                                <div className="bg-gradient-to-br from-warm-700 to-warm-800 rounded-2xl p-6 shadow-warm text-white">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white/60 text-xs uppercase tracking-wide font-semibold mb-1">Onderdeel van</p>
                                            <h3 className="font-serif text-xl mb-1">{outing.title}</h3>
                                            <p className="text-white/70 text-sm mb-4">
                                                Uitje naar {venue?.name || outing.location} &mdash; lees het volledige verhaal.
                                            </p>
                                            <Link
                                                href={`/uitjes/${outing.slug}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-warm-700 rounded-lg font-medium text-sm hover:bg-warm-50 transition-colors shadow"
                                            >
                                                Lees het verhaal
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-5">

                            {/* Venue */}
                            {venue && (
                                <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                                    <div className="bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-3 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <h3 className="font-semibold text-white text-sm">Locatie</h3>
                                    </div>
                                    {venue.featured_image && (
                                        <img src={venue.featured_image} alt={venue.name} className="w-full h-36 object-cover" />
                                    )}
                                    <div className="p-5">
                                        <h4 className="font-serif text-lg text-warm-700 mb-1">{venue.name}</h4>
                                        {venue.description && (
                                            <p className="text-warm-500 text-sm mb-4 leading-relaxed">{venue.description}</p>
                                        )}
                                        <div className="space-y-2 text-sm">
                                            {venue.city && (
                                                <div className="flex items-center gap-2 text-warm-600">
                                                    <svg className="w-4 h-4 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {venue.city}{venue.country && `, ${venue.country}`}
                                                </div>
                                            )}
                                            {venue.address && (
                                                <div className="flex items-center gap-2 text-warm-600">
                                                    <svg className="w-4 h-4 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                    </svg>
                                                    {venue.address}
                                                </div>
                                            )}
                                            {venue.website && (
                                                <a
                                                    href={venue.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium transition-colors"
                                                >
                                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    Website bezoeken
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Bezoekinfo */}
                            {outing && (
                                <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                                    <div className="bg-gradient-to-r from-accent-500 to-amber-400 px-5 py-3 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <h3 className="font-semibold text-white text-sm">Ons bezoek</h3>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-warm-400 font-medium">Bezocht op</p>
                                                <p className="text-warm-700 font-semibold text-sm">
                                                    {outing.visit_date ? formatDate(outing.visit_date) : 'Datum onbekend'}
                                                </p>
                                            </div>
                                        </div>
                                        {outing.price_info && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-warm-400 font-medium">Kosten</p>
                                                    <p className="text-warm-700 font-semibold text-sm">{outing.price_info}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 ${outing.is_recommended ? 'bg-emerald-100' : 'bg-warm-100'} rounded-lg flex items-center justify-center shrink-0`}>
                                                <svg className={`w-4 h-4 ${outing.is_recommended ? 'text-emerald-600' : 'text-warm-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-warm-400 font-medium">Aanrader</p>
                                                <p className="text-warm-700 font-semibold text-sm">
                                                    {outing.is_recommended ? 'Zeker doen!' : 'Leuk om te doen'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tip */}
                            <div className="bg-gradient-to-br from-warm-700 to-warm-800 rounded-2xl p-5 shadow-warm">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-warm-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-white text-sm">Tip</h3>
                                </div>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    {outing
                                        ? `Ga je ook naar ${venue?.name || outing.location}? Lees ons volledige verhaal voor meer tips en ervaringen!`
                                        : 'Meer ontdekkingen vind je op de homepage!'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
