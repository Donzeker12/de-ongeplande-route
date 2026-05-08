import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navigation from '@/Components/Navigation';
import type { Discovery, DierMetadata, Outing, Venue } from '@/types';

interface Props {
    discovery: Discovery & {
        outing: Outing | null;
    };
    outing: Outing | null;
    venue: Venue | null;
}

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

    const formatTime = (timeString?: string) => {
        if (!timeString) return 'Niet beschikbaar';
        return timeString;
    };

    return (
        <>
            <Head title={`${discovery.title} - De Ongeplande Route`} />

            <div className="min-h-screen bg-warm-bg">
                <Navigation />

                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Breadcrumb */}
                    <nav className="mb-8">
                        <div className="flex items-center space-x-2 text-sm text-warm-600">
                            <Link href="/" className="hover:text-warm-700 transition-colors">
                                Home
                            </Link>
                            {outing && (
                                <>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                <Link href={`/uitjes/${outing.slug}`} className="hover:text-warm-700 transition-colors">
                                    {outing.title}
                                </Link>
                                </>
                            )}
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-warm-700">{discovery.title}</span>
                        </div>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="card p-8">
                                {/* Discovery Header */}
                                <div className="mb-6">
                                    <span className="inline-block px-3 py-1 bg-warm-100 text-warm-700 text-sm rounded-full font-medium mb-4">
                                        {discovery.type}
                                    </span>
                                    <h1 className="text-4xl font-serif text-warm-700 mb-4">
                                        {discovery.title}
                                    </h1>
                                    <div className="flex items-center text-warm-600 text-sm mb-6">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {outing ? (
                                            <>Ontdekt tijdens: <Link href={`/uitjes/${outing.slug}`} className="text-warm-700 hover:underline ml-1">{outing.title}</Link></>
                                        ) : 'Standalone ontdekking'}
                                    </div>
                                </div>

                                {/* Discovery Image */}
                                {discovery.image && (
                                    <div className="mb-8">
                                        <div
                                            className="relative cursor-zoom-in group"
                                            onClick={() => setLightboxOpen(true)}
                                        >
                                            <img
                                                src={discovery.image}
                                                alt={discovery.title}
                                                className="w-full h-56 sm:h-72 md:h-96 object-cover rounded-xl shadow-lg transition-transform duration-200 group-hover:scale-[1.01]"
                                            />
                                            {/* Tap-to-enlarge hint */}
                                            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm pointer-events-none">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                </svg>
                                                Vergroot
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Lightbox */}
                                {lightboxOpen && discovery.image && (
                                    <div
                                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
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
                                    </div>
                                )}

                                {/* Discovery Description */}
                                <div className="prose prose-warm max-w-none">
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
                                    const facts = [
                                        { label: 'Wetenschappelijke naam', value: m.wetenschappelijke_naam, italic: true },
                                        { label: 'Voedsel', value: m.voedsel },
                                        { label: 'Gewicht', value: m.gewicht },
                                        { label: 'Lengte', value: m.lengte },
                                        { label: 'Leefgebied', value: m.leefgebied },
                                        { label: 'Bedreigingsstatus', value: m.bedreigingsstatus ? (bedreigingLabels[m.bedreigingsstatus] ?? m.bedreigingsstatus) : undefined },
                                        { label: 'Nesttijd', value: m.nesttijd },
                                        { label: 'Zorgtijd', value: m.zorgtijd },
                                        { label: 'Geslachtsrijp', value: m.geslachtsrijp },
                                        { label: 'Leeftijd (wild)', value: m.leeftijd_wild },
                                        { label: 'Sociaal gedrag', value: m.sociaal_gedrag },
                                    ].filter(f => f.value);

                                    return (
                                        <>
                                            {facts.length > 0 && (
                                                <div className="mt-8">
                                                    <h2 className="text-xl font-serif text-warm-700 mb-4">Feiten</h2>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {facts.map(({ label, value, italic }) => (
                                                            <div key={label} className="flex flex-col px-4 py-3 bg-warm-50 rounded-lg">
                                                                <span className="text-xs text-warm-500 uppercase tracking-wide font-medium">{label}</span>
                                                                <span className={`text-warm-700 font-medium mt-0.5 ${italic ? 'italic' : ''}`}>{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {m.weetje_tekst && (
                                                <div className="mt-6 p-5 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl">
                                                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">💡 Weetje</p>
                                                    <p className="text-warm-700 leading-relaxed">{m.weetje_tekst}</p>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}

                                {/* Metadata: Plek */}
                                {discovery.type === 'plek' && discovery.metadata?.weetje_tekst && (
                                    <div className="mt-6 p-5 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl">
                                        <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">💡 Weetje</p>
                                        <p className="text-warm-700 leading-relaxed">{discovery.metadata.weetje_tekst}</p>
                                    </div>
                                )}

                                {/* Metadata: Weetje (source) */}
                                {discovery.type === 'weetje' && discovery.metadata?.bron && (
                                    <div className="mt-6 p-4 bg-warm-50 rounded-xl flex items-center gap-3">
                                        <svg className="w-4 h-4 text-warm-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        <span className="text-sm text-warm-600">Bron: <span className="text-warm-700 font-medium">{discovery.metadata.bron}</span></span>
                                    </div>
                                )}

                                {/* Related Outing Link */}
                                {outing && (
                                <div className="mt-8 p-6 bg-warm-50 rounded-xl">
                                    <h3 className="font-serif text-xl text-warm-700 mb-3">
                                        Meer over dit uitje
                                    </h3>
                                    <p className="text-warm-600 mb-4">
                                        Deze ontdekking is onderdeel van ons uitje naar {venue?.name || outing.location}.
                                    </p>
                                    <Link 
                                        href={`/uitjes/${outing.slug}`}
                                        className="inline-flex items-center px-4 py-2 bg-warm-700 text-white rounded-lg hover:bg-warm-800 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        Lees het volledige verhaal
                                    </Link>
                                </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Venue Information */}
                            {venue && (
                                <div className="card p-6">
                                    <h3 className="font-serif text-xl text-warm-700 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Locatie Info
                                    </h3>

                                    {/* Venue Image */}
                                    {venue.featured_image && (
                                        <div className="mb-4">
                                            <img 
                                                src={venue.featured_image} 
                                                alt={venue.name}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}

                                    <h4 className="font-semibold text-warm-700 text-lg mb-2">{venue.name}</h4>
                                    
                                    {venue.description && (
                                        <p className="text-warm-600 text-sm mb-4 leading-relaxed">
                                            {venue.description}
                                        </p>
                                    )}

                                    <div className="space-y-3 text-sm">
                                        {venue.city && (
                                            <div className="flex items-start">
                                                <svg className="w-4 h-4 mr-2 mt-0.5 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-warm-600">
                                                    {venue.city}{venue.country && `, ${venue.country}`}
                                                </span>
                                            </div>
                                        )}

                                        {venue.address && (
                                            <div className="flex items-start">
                                                <svg className="w-4 h-4 mr-2 mt-0.5 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                                <span className="text-warm-600">{venue.address}</span>
                                            </div>
                                        )}

                                        {venue.website && (
                                            <div className="flex items-start">
                                                <svg className="w-4 h-4 mr-2 mt-0.5 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                <a 
                                                    href={venue.website} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-warm-700 hover:underline"
                                                >
                                                    Website bezoeken
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Visit Information */}
                            {outing && (
                            <div className="card p-6">
                                <h3 className="font-serif text-xl text-warm-700 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Ons Bezoek
                                </h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start">
                                        <svg className="w-4 h-4 mr-2 mt-0.5 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <div>
                                            <span className="text-warm-500 block">Bezocht op:</span>
                                            <span className="text-warm-700 font-medium">
                                                {outing.visit_date ? formatDate(outing.visit_date) : 'Datum onbekend'}
                                            </span>
                                        </div>
                                    </div>

                                    {outing.price_info && (
                                        <div className="flex items-start">
                                            <svg className="w-4 h-4 mr-2 mt-0.5 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                            <div>
                                                <span className="text-warm-500 block">Kosten:</span>
                                                <span className="text-warm-700 font-medium">{outing.price_info}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start">
                                        <svg className="w-4 h-4 mr-2 mt-0.5 text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <span className="text-warm-500 block">Aanrader:</span>
                                            <span className="text-warm-700 font-medium">
                                                {outing.is_recommended ? 'Ja, zeker doen!' : 'Leuk om te doen'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )}

                            {/* Tips Box */}
                            <div className="card p-6 bg-warm-50">
                                <h3 className="font-serif text-xl text-warm-700 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    Tip
                                </h3>
                                <p className="text-warm-600 text-sm leading-relaxed">
                                    {outing ? `Ga je ook naar ${venue?.name || outing.location}? Lees ons volledige verhaal voor meer tips en ervaringen!` : 'Meer ontdekkingen vind je op de homepage!'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}