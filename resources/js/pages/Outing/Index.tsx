import Navigation from '@/Components/Navigation';
import Seo from '@/Components/Seo';
import type { Outing } from '@/types';
import { Link } from '@inertiajs/react';

interface Props {
    outings: Outing[];
}

export default function OutingIndex({ outings }: Props) {
    const siteUrl = window.location.origin;

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Alle uitjes – De Ongeplande Route',
        url: `${siteUrl}/uitjes`,
        numberOfItems: outings.length,
        itemListElement: outings.map((o, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: o.title,
            url: `${siteUrl}/uitjes/${o.slug}`,
        })),
    };

    return (
        <>
            <Seo
                title="Alle uitjes"
                description="Alle spontane uitjes van De Ongeplande Route – van dierentuinen tot pretparken en alles daartussenin."
                url={`${siteUrl}/uitjes`}
                structuredData={structuredData}
            />
            <Navigation variant="page" />

            <main className="min-h-screen bg-warm-50">
                {/* Header */}
                <div className="bg-white border-b border-warm-200">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                        <h1 className="text-4xl font-serif font-bold text-warm-800">Alle uitjes</h1>
                        <p className="mt-2 text-warm-500 text-lg">
                            {outings.length} avonturen gedeeld op De Ongeplande Route
                        </p>
                    </div>
                </div>

                {/* Grid */}
                <div className="max-w-5xl mx-auto px-6 py-10">
                    {outings.length === 0 ? (
                        <p className="text-center text-warm-400 py-20">Nog geen uitjes gepubliceerd.</p>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {outings.map((outing) => (
                                <Link
                                    key={outing.id}
                                    href={`/uitjes/${outing.slug}`}
                                    className="group bg-white rounded-2xl border border-warm-200 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                                >
                                    {/* Image */}
                                    <div className="aspect-[4/3] overflow-hidden bg-warm-100 relative">
                                        {outing.featured_image ? (
                                            <img
                                                src={outing.featured_image}
                                                alt={outing.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-5xl opacity-20">🗺️</span>
                                            </div>
                                        )}
                                        {outing.is_free && (
                                            <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold shadow-sm">
                                                Gratis
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h2 className="font-serif font-semibold text-warm-800 text-lg leading-tight group-hover:text-amber-700 transition">
                                            {outing.title}
                                        </h2>
                                        <div className="mt-2 flex items-center justify-between">
                                            {outing.city && (
                                                <p className="text-sm text-warm-400 flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    {outing.city}
                                                </p>
                                            )}
                                            {outing.visit_date && (
                                                <p className="text-xs text-warm-300">{outing.visit_date}</p>
                                            )}
                                        </div>
                                        {outing.mood && (
                                            <p className="mt-2 text-sm text-warm-500 line-clamp-2 leading-relaxed">
                                                {outing.mood}
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
