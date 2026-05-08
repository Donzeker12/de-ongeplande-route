import Navigation from '@/Components/Navigation';
import Seo from '@/Components/Seo';
import type { Venue } from '@/types';
import { Link } from '@inertiajs/react';

interface Props {
    venue: Venue;
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

export default function VenueShow({ venue }: Props) {
    const siteUrl = window.location.origin;
    const canonicalUrl = `${siteUrl}/locaties/${venue.slug}`;

    const description =
        venue.seo_description ??
        (venue.city
            ? `Ontdek ${venue.name} in ${venue.city} – een ${venue.type_label} voor het hele gezin via De Ongeplande Route.`
            : `${venue.name} – een ${venue.type_label} ontdekt via De Ongeplande Route.`);

    // JSON-LD structured data
    const priceRange = (() => {
        const entree = venue.prices?.entree ?? [];
        const prices = entree
            .map((e) => parseFloat(e.price.replace(',', '.')))
            .filter((p) => !isNaN(p) && p > 0);
        if (prices.length === 0) { return undefined; }
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max ? `€${min.toFixed(2)}` : `€${min.toFixed(2)} – €${max.toFixed(2)}`;
    })();

    const openingHoursSpec = venue.opening_hours
        ? DAYS.filter((d) => venue.opening_hours?.[d]?.open).map((d) => ({
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: `https://schema.org/${d.charAt(0).toUpperCase() + d.slice(1)}`,
              opens: venue.opening_hours?.[d]?.from ?? '00:00',
              closes: venue.opening_hours?.[d]?.to ?? '00:00',
          }))
        : undefined;

    const structuredData = [
        {
            '@context': 'https://schema.org',
            '@type': ['TouristAttraction', 'LocalBusiness'],
            name: venue.name,
            description,
            url: canonicalUrl,
            ...(venue.featured_image && { image: venue.featured_image }),
            ...(venue.website && { sameAs: venue.website }),
            ...(priceRange && { priceRange }),
            ...(openingHoursSpec && { openingHoursSpecification: openingHoursSpec }),
            ...(venue.address || venue.city
                ? {
                      address: {
                          '@type': 'PostalAddress',
                          ...(venue.address && { streetAddress: venue.address }),
                          ...(venue.city && { addressLocality: venue.city }),
                          addressCountry: venue.country ?? 'NL',
                      },
                  }
                : {}),
            ...(venue.city && {
                location: {
                    '@type': 'Place',
                    name: venue.city,
                },
            }),
            touristType: venue.type_label,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Locaties', item: `${siteUrl}/locaties` },
                { '@type': 'ListItem', position: 3, name: venue.name, item: canonicalUrl },
            ],
        },
    ];

    const hasOpeningHours = venue.opening_hours && Object.keys(venue.opening_hours).length > 0;
    const hasPrices =
        venue.prices && Object.values(venue.prices).some((cat) => Array.isArray(cat) && cat.length > 0);

    return (
        <>
            <Seo
                title={venue.name}
                description={description}
                image={venue.featured_image ?? undefined}
                url={canonicalUrl}
                geoPlacename={venue.city ?? undefined}
                geoRegion={venue.city ? `NL-${venue.city}` : undefined}
                structuredData={structuredData}
                modifiedAt={venue.updated_at}
            />
            <Navigation variant="page" />

            <main className="min-h-screen bg-warm-50">
                {/* Hero */}
                <div className="relative h-64 md:h-96 overflow-hidden">
                    {venue.featured_image ? (
                        <img
                            src={venue.featured_image}
                            alt={venue.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-warm-200 to-warm-300 flex items-center justify-center">
                            <span className="text-8xl opacity-40">{venue.type_emoji}</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                        <div className="max-w-4xl mx-auto">
                            <Link
                                href="/locaties"
                                className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-3 transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Alle locaties
                            </Link>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                                    <span>{venue.type_emoji}</span>
                                    <span>{venue.type_label}</span>
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-serif text-white font-bold">{venue.name}</h1>
                            {venue.city && (
                                <p className="mt-2 text-white/80 flex items-center gap-1.5">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {venue.city}{venue.country && venue.country !== 'Nederland' ? `, ${venue.country}` : ''}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">

                    {/* Beschrijving */}
                    {venue.description && (
                        <section>
                            <p className="text-warm-700 leading-relaxed text-lg">{venue.description}</p>
                        </section>
                    )}

                    {/* Highlights */}
                    {venue.highlights && (
                        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                            <h2 className="text-lg font-serif font-semibold text-warm-800 mb-3 flex items-center gap-2">
                                <span>✨</span> Wat maakt deze plek bijzonder?
                            </h2>
                            <p className="text-warm-700 leading-relaxed whitespace-pre-line">{venue.highlights}</p>
                        </section>
                    )}

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Openingstijden */}
                        {hasOpeningHours && (
                            <section>
                                <h2 className="text-lg font-serif font-semibold text-warm-800 mb-4 flex items-center gap-2">
                                    <span>🕐</span> Openingstijden
                                </h2>
                                <div className="bg-white rounded-xl border border-warm-200 divide-y divide-warm-100 shadow-sm overflow-hidden">
                                    {DAYS.map((day) => {
                                        const s = venue.opening_hours?.[day];
                                        if (!s) { return null; }
                                        return (
                                            <div key={day} className="flex items-center justify-between px-4 py-2.5 text-sm">
                                                <span className="font-medium text-warm-700 w-24">{DAY_LABELS[day]}</span>
                                                {s.open ? (
                                                    <span className="text-warm-600">
                                                        {s.from} – {s.to}
                                                    </span>
                                                ) : (
                                                    <span className="text-warm-400 italic">Gesloten</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Praktische info */}
                        <section>
                            <h2 className="text-lg font-serif font-semibold text-warm-800 mb-4 flex items-center gap-2">
                                <span>📍</span> Praktische info
                            </h2>
                            <div className="bg-white rounded-xl border border-warm-200 divide-y divide-warm-100 shadow-sm overflow-hidden">
                                {venue.address && (
                                    <div className="flex items-start gap-3 px-4 py-3 text-sm">
                                        <svg className="w-4 h-4 text-warm-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-warm-700">{venue.address}</p>
                                            {venue.city && <p className="text-warm-500">{venue.city}, {venue.country}</p>}
                                        </div>
                                    </div>
                                )}
                                {venue.website && (
                                    <div className="flex items-center gap-3 px-4 py-3 text-sm">
                                        <svg className="w-4 h-4 text-warm-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                                        </svg>
                                        <a
                                            href={venue.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-amber-600 hover:text-amber-700 hover:underline font-medium transition"
                                        >
                                            Bezoek website
                                        </a>
                                    </div>
                                )}
                                {!venue.address && !venue.website && (
                                    <div className="px-4 py-3 text-sm text-warm-400 italic">Nog geen info beschikbaar</div>
                                )}
                            </div>

                            {/* Google Maps link */}
                            {(venue.address || venue.city) && (
                                <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent([venue.address, venue.city, venue.country].filter(Boolean).join(', '))}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-flex items-center gap-2 text-sm text-warm-500 hover:text-warm-700 transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    Bekijk op Google Maps
                                </a>
                            )}
                        </section>
                    </div>

                    {/* Prijzen */}
                    {hasPrices && (
                        <section>
                            <h2 className="text-lg font-serif font-semibold text-warm-800 mb-4 flex items-center gap-2">
                                <span>💶</span> Prijzen
                            </h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(venue.prices ?? {})
                                    .filter(([, entries]) => Array.isArray(entries) && entries.length > 0)
                                    .map(([cat, entries]) => (
                                        <div key={cat} className="bg-white rounded-xl border border-warm-200 shadow-sm overflow-hidden">
                                            <div className="px-4 py-2 bg-warm-50 border-b border-warm-100">
                                                <span className="text-xs font-semibold text-warm-600 uppercase tracking-wider">
                                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                </span>
                                            </div>
                                            <div className="divide-y divide-warm-100">
                                                {entries.map((entry, i) => (
                                                    <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                                                        <span className="text-warm-700">{entry.label}</span>
                                                        <span className="font-semibold text-warm-800">
                                                            {entry.price ? `€ ${entry.price}` : 'Gratis'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </section>
                    )}

                    {/* Toegankelijkheid */}
                    {(venue.accessibility_transport || venue.accessibility_facilities) && (
                        <section>
                            <h2 className="text-lg font-serif font-semibold text-warm-800 mb-4 flex items-center gap-2">
                                <span>♿</span> Bereikbaarheid & faciliteiten
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {venue.accessibility_transport && (
                                    <div className="bg-white rounded-xl border border-warm-200 p-5 shadow-sm">
                                        <h3 className="text-sm font-semibold text-warm-700 mb-2 flex items-center gap-1.5">
                                            <span>🚌</span> Bereikbaarheid
                                        </h3>
                                        <p className="text-sm text-warm-600 leading-relaxed whitespace-pre-line">
                                            {venue.accessibility_transport}
                                        </p>
                                    </div>
                                )}
                                {venue.accessibility_facilities && (
                                    <div className="bg-white rounded-xl border border-warm-200 p-5 shadow-sm">
                                        <h3 className="text-sm font-semibold text-warm-700 mb-2 flex items-center gap-1.5">
                                            <span>🛗</span> Faciliteiten
                                        </h3>
                                        <p className="text-sm text-warm-600 leading-relaxed whitespace-pre-line">
                                            {venue.accessibility_facilities}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </>
    );
}
