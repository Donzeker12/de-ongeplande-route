import { Link } from '@inertiajs/react';
import Navigation from '@/Components/Navigation';
import Seo from '@/Components/Seo';
import type { HomePageProps } from '@/types';

export default function Home({ latestOutings, recommendedOutings, newDiscoveries, categories, activeCategory, heroSettings, latestStories, featuredVenues }: HomePageProps) {
    const siteUrl = window.location.origin;

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'De Ongeplande Route',
        url: siteUrl,
        description: 'Een familie die zonder plan op pad gaat. Spontane uitjes, eerlijke verhalen en onverwachte plekken in Nederland.',
        inLanguage: 'nl-NL',
        potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/?category={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'De Ongeplande Route',
        url: siteUrl,
        description: 'Geen plan. Wel verhalen. Een familie die spontane uitjes deelt.',
        inLanguage: 'nl-NL',
    };
    return (
        <>
            <Seo
                title="De Ongeplande Route – Geen plan. Wel verhalen."
                description="Een familie die zonder plan op pad gaat. Spontane uitjes, eerlijke verhalen en onverwachte plekken in Nederland."
                structuredData={[websiteSchema, organizationSchema]}
            />

            <div className="min-h-screen bg-warm-bg">
                {/* Navigation */}
                <Navigation variant="home" />

                {/* Hero Section */}
                <section className="relative h-screen flex items-center justify-center overflow-hidden">
                    {/* Background Image */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center hero-image"
                        style={{ backgroundImage: `url(${heroSettings.background_url})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
                        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tight leading-[0.9] animate-fade-in-up">
                            {heroSettings.title.split(' ').slice(0, Math.ceil(heroSettings.title.split(' ').length / 2)).join(' ')}<br />
                            {heroSettings.title.split(' ').slice(Math.ceil(heroSettings.title.split(' ').length / 2)).join(' ')}
                        </h1>
                        <p className="text-sm md:text-base uppercase tracking-[0.4em] opacity-90 mb-8 font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            {heroSettings.subtitle}
                        </p>
                        <p className="text-xl md:text-2xl opacity-95 font-light leading-relaxed mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            {heroSettings.description}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            <Link 
                                href="#uitjes" 
                                className="px-8 py-4 bg-white text-warm-700 rounded-full font-medium hover:bg-warm-50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                            >
                                Ontdek Onze Verhalen
                            </Link>
                            <Link 
                                href="/over-ons" 
                                className="px-8 py-4 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-warm-700 transition-all duration-300 hover:-translate-y-1"
                            >
                                Over Ons
                            </Link>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
                        <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </section>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6">

                    {/* Brand Pillars */}
                    <section className="py-16 -mt-10 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-warm-200 rounded-3xl overflow-hidden shadow-warm">
                            <div className="bg-warm-bg px-8 py-10 flex items-start gap-5">
                                <span className="text-4xl shrink-0">🧭</span>
                                <div>
                                    <h3 className="font-serif text-xl text-warm-800 mb-2">Geen plan</h3>
                                    <p className="text-sm text-warm-500 leading-relaxed">We vertrekken zonder route — dat is precies het idee</p>
                                </div>
                            </div>
                            <div className="bg-warm-bg px-8 py-10 flex items-start gap-5">
                                <span className="text-4xl shrink-0">✍️</span>
                                <div>
                                    <h3 className="font-serif text-xl text-warm-800 mb-2">Eerlijke verhalen</h3>
                                    <p className="text-sm text-warm-500 leading-relaxed">Geen gesponsorde content — gewoon wat we echt meemaakten</p>
                                </div>
                            </div>
                            <div className="bg-warm-bg px-8 py-10 flex items-start gap-5">
                                <span className="text-4xl shrink-0">🗺️</span>
                                <div>
                                    <h3 className="font-serif text-xl text-warm-800 mb-2">Altijd onderweg</h3>
                                    <p className="text-sm text-warm-500 leading-relaxed">Van dierentuin tot bos, van kust tot binnenstad</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Verhalen — editorial magazine layout */}
                    <section className="py-20">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 mb-3">Van ons gezin</p>
                                <h2 className="text-4xl md:text-5xl font-serif text-warm-800 leading-tight">Onze Verhalen</h2>
                            </div>
                            <Link
                                href="/verhalen"
                                className="self-start sm:self-auto inline-flex items-center gap-1.5 text-sm font-medium text-warm-600 hover:text-warm-800 transition-colors whitespace-nowrap"
                            >
                                Alle verhalen
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </Link>
                        </div>

                        {latestStories.length === 0 ? (
                            <div className="text-center py-24 bg-warm-50 rounded-3xl">
                                <p className="text-warm-400 text-lg">Nog geen verhalen gepubliceerd. Kom snel terug!</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {/* Featured story — horizontal */}
                                <Link
                                    href={`/verhalen/${latestStories[0].slug}`}
                                    className="group flex flex-col md:flex-row rounded-3xl overflow-hidden bg-white border border-warm-100 shadow-sm hover:shadow-lg transition-all duration-500 block"
                                >
                                    <div className="relative md:w-3/5 shrink-0 overflow-hidden aspect-video md:aspect-auto">
                                        {latestStories[0].featured_image ? (
                                            <img
                                                src={latestStories[0].featured_image}
                                                alt={latestStories[0].title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 min-h-[240px]"
                                            />
                                        ) : (
                                            <div className="w-full h-full min-h-[240px] bg-gradient-to-br from-warm-200 to-warm-300 flex items-center justify-center">
                                                <span className="text-6xl opacity-30">✍️</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center px-8 py-10 md:py-12 flex-1">
                                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 mb-4">Uitgelicht verhaal</span>
                                        {latestStories[0].published_at && (
                                            <p className="text-xs text-warm-400 mb-3">
                                                {new Date(latestStories[0].published_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        )}
                                        <h3 className="font-serif text-2xl md:text-3xl text-warm-800 leading-tight mb-4 group-hover:text-warm-900 transition-colors">{latestStories[0].title}</h3>
                                        {latestStories[0].description && (
                                            <p className="text-warm-500 leading-relaxed line-clamp-3 mb-6 text-base">{latestStories[0].description}</p>
                                        )}
                                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 group-hover:text-amber-700 transition">
                                            Lees het verhaal
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </span>
                                    </div>
                                </Link>

                                {/* Story grid */}
                                {latestStories.length > 1 && (
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                        {latestStories.slice(1, 5).map((story) => (
                                            <Link
                                                key={story.id}
                                                href={`/verhalen/${story.slug}`}
                                                className="group bg-white rounded-2xl overflow-hidden border border-warm-100 hover:border-warm-200 hover:shadow-md transition-all duration-300"
                                            >
                                                <div className="aspect-[4/3] overflow-hidden bg-warm-100">
                                                    {story.featured_image ? (
                                                        <img src={story.featured_image} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="text-3xl opacity-30">✍️</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4">
                                                    {story.published_at && (
                                                        <p className="text-[11px] text-warm-400 mb-1.5">
                                                            {new Date(story.published_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    )}
                                                    <h3 className="font-serif text-sm font-semibold text-warm-800 leading-snug line-clamp-2 group-hover:text-warm-900 transition-colors">{story.title}</h3>
                                                    <span className="mt-3 text-xs font-semibold text-amber-600 group-hover:text-amber-700 transition inline-flex items-center gap-1">
                                                        Lezen <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Locaties */}
                    {featuredVenues.length > 0 && (
                        <section className="py-20 border-t border-warm-100">
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 mb-3">Plekken die we bezochten</p>
                                    <h2 className="text-4xl md:text-5xl font-serif text-warm-800 leading-tight">Locaties</h2>
                                </div>
                                <Link
                                    href="/locaties"
                                    className="self-start sm:self-auto inline-flex items-center gap-1.5 text-sm font-medium text-warm-600 hover:text-warm-800 transition-colors whitespace-nowrap"
                                >
                                    Alle locaties
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                {featuredVenues.map((venue) => (
                                    <Link
                                        key={venue.id}
                                        href={`/locaties/${venue.slug}`}
                                        className="group bg-white rounded-2xl overflow-hidden border border-warm-100 hover:border-warm-200 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="aspect-[4/3] overflow-hidden bg-warm-100 relative">
                                            {venue.featured_image ? (
                                                <img
                                                    src={venue.featured_image}
                                                    alt={venue.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-warm-100 to-warm-200">
                                                    <span className="text-4xl opacity-40">{venue.type_emoji}</span>
                                                </div>
                                            )}
                                            <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-warm-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                                                {venue.type_emoji} {venue.type_label}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-serif text-sm font-semibold text-warm-800 leading-snug line-clamp-2 group-hover:text-warm-900 transition-colors">{venue.name}</h3>
                                            {venue.city && (
                                                <p className="mt-1 text-[11px] text-warm-400 flex items-center gap-1">
                                                    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    {venue.city}
                                                </p>
                                            )}
                                            <span className="mt-3 text-xs font-semibold text-amber-600 group-hover:text-amber-700 transition inline-flex items-center gap-1">
                                                Bekijk locatie <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Ontdekkingen */}
                    {newDiscoveries.length > 0 && (
                        <section className="py-20 border-t border-warm-100">
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 mb-3">Onderweg gezien</p>
                                    <h2 className="text-3xl md:text-4xl font-serif text-warm-800">Ontdekkingen</h2>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {newDiscoveries.slice(0, 8).map((discovery) => (
                                    <Link
                                        key={discovery.id}
                                        href={`/ontdekkingen/${discovery.slug || discovery.id}`}
                                        className="group bg-white rounded-2xl overflow-hidden border border-warm-100 hover:border-warm-200 hover:shadow-md transition-all duration-300"
                                    >
                                        {discovery.image ? (
                                            <div className="aspect-video overflow-hidden">
                                                <img src={discovery.image} alt={discovery.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-warm-50 flex items-center justify-center">
                                                <span className="text-3xl opacity-40">✨</span>
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">{discovery.type}</span>
                                            <h3 className="font-serif text-sm font-semibold text-warm-800 mt-1 leading-snug line-clamp-2 group-hover:text-warm-900 transition-colors">{discovery.title}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Call to Action */}
                <section className="bg-gradient-to-br from-warm-800 to-warm-900 text-white py-24">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        <p className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] mb-5">Ga mee op reis</p>
                        <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                            Laat je inspireren<br />door onze belevenissen
                        </h2>
                        <p className="text-warm-300 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
                            Geen gesponsorde content, gewoon eerlijke verhalen over wat we meemaakten als gezin
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/verhalen"
                                className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-warm-900 font-semibold rounded-full transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                            >
                                Lees onze verhalen
                            </Link>
                            <Link
                                href="/over-ons"
                                className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Over ons gezin
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-warm-800 text-warm-200 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div>
                                <h3 className="font-serif text-2xl text-white mb-4">de ongeplande route</h3>
                                <p className="text-warm-300 leading-relaxed">
                                    Geen plan. Wel verhalen. Wij rijden, jullie ontdekken mee.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium text-white mb-4">Navigatie</h4>
                                <ul className="space-y-2">
                                    <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                                    <li><Link href="/verhalen" className="hover:text-white transition-colors">Verhalen</Link></li>
                                    <li><Link href="/locaties" className="hover:text-white transition-colors">Locaties</Link></li>
                                    <li><Link href="/over-ons" className="hover:text-white transition-colors">Over Ons</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-white mb-4">Categorieën</h4>
                                <ul className="space-y-2">
                                    {categories.slice(0, 5).map(category => (
                                        <li key={category}>
                                            <Link href={`/?category=${category}`} className="hover:text-white transition-colors">
                                                {category}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-warm-700 pt-8 text-center">
                            <p className="text-warm-400">
                                © {new Date().getFullYear()} De Ongeplande Route. Alle rechten voorbehouden.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}