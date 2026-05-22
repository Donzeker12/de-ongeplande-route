import { Link } from '@inertiajs/react';
import Navigation from '@/Components/Navigation';
import Seo from '@/Components/Seo';
import type { Outing } from '@/types';

interface OutingShowProps {
    outing: Outing;
}

export default function Show({ outing }: OutingShowProps) {
    const siteUrl = window.location.origin;
    const canonicalUrl = `${siteUrl}/uitjes/${outing.slug}`;

    const description = outing.seo_description
        ?? (outing.city
            ? `Ontdek ${outing.title} in ${outing.city} – een spontaan uitje van De Ongeplande Route.`
            : `${outing.title} – een spontaan uitje van De Ongeplande Route.`);

    // JSON-LD: TouristAttraction / BlogPosting
    const structuredData = [
        {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: outing.title,
            description,
            url: canonicalUrl,
            image: outing.featured_image ?? undefined,
            datePublished: outing.published_at ?? undefined,
            dateModified: outing.updated_at ?? outing.published_at ?? undefined,
            author: {
                '@type': 'Organization',
                name: 'De Ongeplande Route',
                url: siteUrl,
            },
            publisher: {
                '@type': 'Organization',
                name: 'De Ongeplande Route',
                url: siteUrl,
            },
            ...(outing.city && {
                locationCreated: {
                    '@type': 'Place',
                    name: outing.city,
                    address: {
                        '@type': 'PostalAddress',
                        addressLocality: outing.city,
                        addressCountry: 'NL',
                    },
                },
            }),
        },
        ...(outing.city ? [{
            '@context': 'https://schema.org',
            '@type': 'TouristAttraction',
            name: outing.title,
            description,
            url: canonicalUrl,
            image: outing.featured_image ?? undefined,
            address: {
                '@type': 'PostalAddress',
                addressLocality: outing.city,
                addressCountry: 'NL',
            },
            ...(outing.category && { touristType: outing.category }),
        }] : []),
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Uitjes', item: `${siteUrl}/uitjes` },
                { '@type': 'ListItem', position: 3, name: outing.title, item: canonicalUrl },
            ],
        },
    ];
    return (
        <>
            <Seo
                title={outing.title}
                description={description}
                image={outing.featured_image}
                url={canonicalUrl}
                type="article"
                geoRegion="NL"
                geoPlacename={outing.city}
                publishedAt={outing.published_at ?? undefined}
                modifiedAt={outing.updated_at ?? undefined}
                structuredData={structuredData}
            />

            <div className="min-h-screen bg-warm-bg">
                <Navigation variant="page" />

                {/* Hero Section with Title Overlay */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
                        {outing.featured_image && (
                            <div className="aspect-[21/9] relative">
                                <img
                                    src={outing.featured_image}
                                    alt={outing.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                
                                {/* Title Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-12 text-white">
                                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
                                        {outing.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm lg:text-base">
                                        {outing.city && (
                                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {outing.city}
                                            </span>
                                        )}
                                        {outing.category && (
                                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                                {outing.category}
                                            </span>
                                        )}
                                        {outing.visit_date && (
                                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {outing.visit_date}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Prijzen kaart */}
                    {(outing.price_info || outing.price_details) && (
                        <div className="card p-6 lg:p-8 -mt-12 relative z-10 mx-4 lg:mx-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-warm-700">Prijzen</h3>
                                    {outing.price_info && <p className="text-sm text-warm-500">{outing.price_info}</p>}
                                </div>
                            </div>

                            {outing.price_details && (
                                <>
                                    {/* Per categorie */}
                                    {(outing.price_details.adult || outing.price_details.child || outing.price_details.senior || outing.price_details.baby) && (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                            {outing.price_details.adult && (
                                                <div className="bg-warm-50 rounded-xl p-3 text-center">
                                                    <div className="text-lg mb-1">🧑</div>
                                                    <div className="text-xs text-warm-500 mb-1">Volwassene</div>
                                                    <div className="font-semibold text-warm-700 text-sm">{outing.price_details.adult}</div>
                                                </div>
                                            )}
                                            {outing.price_details.child && (
                                                <div className="bg-warm-50 rounded-xl p-3 text-center">
                                                    <div className="text-lg mb-1">🧒</div>
                                                    <div className="text-xs text-warm-500 mb-1">Kind</div>
                                                    <div className="font-semibold text-warm-700 text-sm">{outing.price_details.child}</div>
                                                </div>
                                            )}
                                            {outing.price_details.senior && (
                                                <div className="bg-warm-50 rounded-xl p-3 text-center">
                                                    <div className="text-lg mb-1">👴</div>
                                                    <div className="text-xs text-warm-500 mb-1">Senior 65+</div>
                                                    <div className="font-semibold text-warm-700 text-sm">{outing.price_details.senior}</div>
                                                </div>
                                            )}
                                            {outing.price_details.baby && (
                                                <div className="bg-warm-50 rounded-xl p-3 text-center">
                                                    <div className="text-lg mb-1">👶</div>
                                                    <div className="text-xs text-warm-500 mb-1">Baby / Peuter</div>
                                                    <div className="font-semibold text-warm-700 text-sm">{outing.price_details.baby}</div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Passen */}
                                    {outing.price_details.passes && outing.price_details.passes.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-xs font-medium text-warm-500 uppercase tracking-wider mb-2">Kortingspassen</p>
                                            <div className="flex flex-wrap gap-2">
                                                {outing.price_details.passes.map((pass, i) => (
                                                    <div key={i} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
                                                        <span className="text-sm">🎫</span>
                                                        <span className="text-sm font-medium text-green-800">{pass.name}</span>
                                                        {pass.discount && <span className="text-xs text-green-600">— {pass.discount}</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Opmerking */}
                                    {outing.price_details.notes && (
                                        <p className="text-xs text-warm-500 italic">{outing.price_details.notes}</p>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Content - Two Column Layout */}
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Onze ervaring Section */}
                            <section className="animate-fade-in-up">
                                <h2 className="font-serif text-3xl text-warm-700 mb-6">Onze ervaring</h2>
                                {outing.story && (
                                    <div className="prose prose-lg max-w-none">
                                        <p className="text-warm-600 leading-relaxed text-base lg:text-lg" style={{ whiteSpace: 'pre-line' }}>
                                            {outing.story}
                                        </p>
                                    </div>
                                )}
                            </section>

                            {/* Sfeerbeelden Section */}
                            {outing.images && outing.images.length > 0 && (
                                <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                    <h2 className="font-serif text-3xl text-warm-700 mb-6">Sfeerbeelden</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {outing.images.slice(0, 4).map((image, index) => (
                                            <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                                                <img
                                                    src={image}
                                                    alt={`${outing.title} foto ${index + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Onze eerlijke indruk Section */}
                            <section>
                                <h2 className="font-serif text-3xl text-warm-brown mb-6">Onze eerlijke indruk</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Wat vonden we top */}
                                    <div className="bg-white rounded-xl p-6 shadow-md">
                                        <h3 className="flex items-center gap-2 text-lg font-semibold text-green-700 mb-4">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Wat vonden we top
                                        </h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2 text-warm-brown text-sm">
                                                <span className="text-green-600 mt-0.5">•</span>
                                                <span>Overdekte jungle</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-warm-brown text-sm">
                                                <span className="text-green-600 mt-0.5">•</span>
                                                <span>Veel ruimte</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Minder leuk */}
                                    <div className="bg-white rounded-xl p-6 shadow-md">
                                        <h3 className="flex items-center gap-2 text-lg font-semibold text-red-700 mb-4">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Minder leuk
                                        </h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2 text-warm-brown text-sm">
                                                <span className="text-red-600 mt-0.5">•</span>
                                                <span>Parkeren prijzig</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-warm-brown text-sm">
                                                <span className="text-red-600 mt-0.5">•</span>
                                                <span>Zondag erg druk</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right Sidebar - Discoveries (Compact Cards) */}
                        <div className="lg:col-span-1">
                            {outing.discoveries && outing.discoveries.length > 0 && (
                                <div className="sticky top-24">
                                    <h2 className="font-serif text-2xl text-warm-brown mb-6">Wat we ontdekten</h2>
                                    <div className="space-y-4">
                                        {outing.discoveries.map((discovery) => (
                                            <div 
                                                key={discovery.id} 
                                                className="relative bg-gradient-to-br from-[#f5f1e8] to-[#ebe6d9] rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                                                style={{
                                                    boxShadow: '0 2px 12px rgba(58, 56, 52, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                                                }}
                                            >
                                                {/* Decorative paw prints - smaller */}
                                                <div className="absolute bottom-2 right-2 opacity-8 text-warm-brown">
                                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-5 2c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm10 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm2-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                                                    </svg>
                                                </div>

                                                {/* Compact Title */}
                                                <h3 className="font-serif text-lg text-warm-brown mb-1 leading-tight relative z-10 pr-8">
                                                    {discovery.title}
                                                </h3>
                                                <p className="text-xs italic text-warm-brown/50 mb-3 relative z-10">– wist je dat...</p>

                                                {/* Smaller Image */}
                                                {discovery.image && (
                                                    <div className="aspect-[16/10] rounded-lg overflow-hidden mb-3 shadow-sm border-2 border-white relative z-10">
                                                        <img
                                                            src={discovery.image}
                                                            alt={discovery.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}

                                                {/* Compact Facts - only show 2 max */}
                                                <ul className="space-y-1.5 mb-3 relative z-10">
                                                    <li className="flex items-start gap-2">
                                                        <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span className="text-warm-brown text-xs leading-relaxed">
                                                            {discovery.description || 'Bijzondere ontdekking'}
                                                        </span>
                                                    </li>
                                                    {discovery.type === 'dier' && (
                                                        <li className="flex items-start gap-2">
                                                            <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <span className="text-warm-brown text-xs leading-relaxed">
                                                                Fascinerend om te zien
                                                            </span>
                                                        </li>
                                                    )}
                                                </ul>

                                                {/* Compact Tip */}
                                                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-2.5 border border-warm-brown/10 relative z-10">
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-base flex-shrink-0">🔍</span>
                                                        <div>
                                                            <p className="text-[10px] font-semibold text-warm-brown mb-0.5 uppercase tracking-wider">Onze tip</p>
                                                            <p className="text-xs text-warm-brown/80 leading-snug">
                                                                {discovery.type === 'dier' 
                                                                    ? 'Blijf even stil staan en observeer!'
                                                                    : discovery.type === 'plek'
                                                                    ? 'Kom vroeg voor minder drukte.'
                                                                    : 'De moeite waard om te ontdekken!'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Gerelateerd Section */}
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <h2 className="font-serif text-3xl text-warm-brown mb-8">Gerelateerd</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Placeholder related outings - je kunt dit later dynamisch maken */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                            <div className="relative">
                                <div className="aspect-video bg-warm-gray/20">
                                    <img
                                        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                                        alt="Rommelmarkt Nijmegen"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Gratis
                                </span>
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-2xl text-warm-brown mb-2">Rommelmarkt Nijmegen</h3>
                                <p className="text-warm-brown/60">Nijmegen</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                            <div className="relative">
                                <div className="aspect-video bg-warm-gray/20">
                                    <img
                                        src="https://images.unsplash.com/photo-1578850761919-95e38e4f1b67?w=800&q=80"
                                        alt="Speeltuin"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Gratis
                                </span>
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-2xl text-warm-brown mb-2">Speeltuin De Watertuin</h3>
                                <p className="text-warm-brown/60">Nijmegen</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-warm-700 text-white py-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center">
                            <Link href="/" className="font-serif text-4xl text-white tracking-tight hover:text-white/90 transition-colors">
                                de ongeplande route
                            </Link>
                            <p className="text-xl opacity-90 mt-4 mb-8">Geen plan. Wel verhalen.</p>
                            
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Link 
                                    href="/" 
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    Onze Uitjes
                                </Link>
                                <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full"></div>
                                <Link 
                                    href="/over-ons" 
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    Over Ons
                                </Link>
                                <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full"></div>
                                <Link 
                                    href="/contact" 
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    Contact
                                </Link>
                            </div>
                            
                            <div className="mt-12 pt-8 border-t border-white/20">
                                <p className="text-white/60 text-sm">
                                    © 2024 De Ongeplande Route. Wij rijden. Jullie ontdekken mee.
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
