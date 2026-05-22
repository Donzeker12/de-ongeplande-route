import Navigation from '@/Components/Navigation';
import Seo from '@/Components/Seo';
import type { Venue, VenueType } from '@/types';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    venues: Venue[];
    types: Record<string, VenueType>;
}

export default function VenueIndex({ venues, types }: Props) {
    const [activeType, setActiveType] = useState<string | null>(null);
    const siteUrl = window.location.origin;

    const filtered = activeType ? venues.filter((v) => v.type === activeType) : venues;

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Locaties – De Ongeplande Route',
        description: 'Alle leuke uitjes-locaties ontdekt door De Ongeplande Route.',
        url: `${siteUrl}/locaties`,
        numberOfItems: venues.length,
        itemListElement: venues.map((v, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: v.name,
            url: `${siteUrl}/locaties/${v.slug}`,
        })),
    };

    return (
        <>
            <Seo
                title="Locaties"
                description="Ontdek alle leuke uitjes-locaties die wij bezochten – dierentuinen, pretparken, musea, restaurants en meer."
                url={`${siteUrl}/locaties`}
                structuredData={structuredData}
            />
            <Navigation variant="page" />

            <main className="min-h-screen bg-warm-50">
                {/* Header */}
                <div className="bg-white border-b border-warm-200">
                    <div className="max-w-5xl mx-auto px-6 py-10">
                        <h1 className="text-4xl font-serif font-bold text-warm-800">Locaties</h1>
                        <p className="mt-2 text-warm-500 text-lg">
                            {venues.length} plekken die wij ontdekten en aanraden
                        </p>

                        {/* Type filter */}
                        <div className="mt-6 flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveType(null)}
                                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition border ${
                                    activeType === null
                                        ? 'bg-warm-800 text-white border-warm-800'
                                        : 'bg-white text-warm-600 border-warm-200 hover:border-warm-400'
                                }`}
                            >
                                Alle
                            </button>
                            {Object.entries(types).map(([key, t]) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveType(activeType === key ? null : key)}
                                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition border ${
                                        activeType === key
                                            ? 'bg-warm-800 text-white border-warm-800'
                                            : 'bg-white text-warm-600 border-warm-200 hover:border-warm-400'
                                    }`}
                                >
                                    <span>{t.emoji}</span>
                                    <span>{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="max-w-5xl mx-auto px-6 py-10">
                    {filtered.length === 0 ? (
                        <p className="text-center text-warm-400 py-20">Geen locaties gevonden voor dit type.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((venue) => (
                                <Link
                                    key={venue.id}
                                    href={`/locaties/${venue.slug}`}
                                    className="group bg-white rounded-2xl border border-warm-200 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                                >
                                    {/* Image */}
                                    <div className="aspect-[4/3] overflow-hidden bg-warm-100 relative">
                                        {venue.featured_image ? (
                                            <img
                                                src={venue.featured_image}
                                                alt={venue.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-5xl opacity-30">{venue.type_emoji}</span>
                                            </div>
                                        )}
                                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-warm-700 shadow-sm">
                                            <span>{venue.type_emoji}</span>
                                            <span>{venue.type_label}</span>
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h2 className="font-serif font-semibold text-warm-800 text-lg leading-tight group-hover:text-amber-700 transition">
                                            {venue.name}
                                        </h2>
                                        {venue.city && (
                                            <p className="mt-1 text-sm text-warm-400 flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                                {venue.city}
                                            </p>
                                        )}
                                        {venue.description && (
                                            <p className="mt-2 text-sm text-warm-500 line-clamp-2 leading-relaxed">
                                                {venue.description}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
