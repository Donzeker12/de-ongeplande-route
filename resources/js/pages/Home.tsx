import { Link, router } from '@inertiajs/react';
import Navigation from '@/Components/Navigation';
import OutingCard from '@/Components/OutingCard';
import Seo from '@/Components/Seo';
import type { HomePageProps } from '@/types';

export default function Home({ latestOutings, recommendedOutings, newDiscoveries, categories, activeCategory, heroSettings, latestPosts }: HomePageProps) {
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
    const handleCategoryClick = (category: string) => {
        if (activeCategory === category) {
            router.get('/', {}, { preserveScroll: false });
        } else {
            router.get('/', { category }, { preserveScroll: false });
        }
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
                <div className="max-w-7xl mx-auto px-6">
                    {/* Stats Section */}
                    <section className="py-20 -mt-16 relative z-10">
                        <div className="glass rounded-3xl p-8 shadow-warm">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                                <div className="animate-fade-in-up">
                                    <div className="text-3xl font-bold text-warm-700 mb-2">{latestOutings.length + recommendedOutings.length}</div>
                                    <div className="text-sm text-warm-600 uppercase tracking-wider">Uitjes</div>
                                </div>
                                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                    <div className="text-3xl font-bold text-warm-700 mb-2">{categories.length}</div>
                                    <div className="text-sm text-warm-600 uppercase tracking-wider">Categorieën</div>
                                </div>
                                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                    <div className="text-3xl font-bold text-warm-700 mb-2">{newDiscoveries.length}</div>
                                    <div className="text-sm text-warm-600 uppercase tracking-wider">Ontdekkingen</div>
                                </div>
                                <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                    <div className="text-3xl font-bold text-warm-700 mb-2">100%</div>
                                    <div className="text-sm text-warm-600 uppercase tracking-wider">Spontaan</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Featured Recommendations */}
                    {recommendedOutings.length > 0 && (
                        <section className="py-20">
                            <div className="text-center mb-16 animate-fade-in-up">
                                <h2 className="text-4xl md:text-5xl font-serif mb-6 text-warm-700 tracking-tight gradient-text">
                                    Onze Favorieten
                                </h2>
                                <p className="text-lg text-warm-600 max-w-2xl mx-auto leading-relaxed">
                                    Deze plekken hebben een speciale plek in ons hart gekregen
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {recommendedOutings.map((outing, index) => (
                                    <div 
                                        key={outing.id} 
                                        className="animate-fade-in-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <OutingCard 
                                            outing={outing} 
                                            size="default"
                                            showDescription={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Latest Outings Section */}
                    <section id="uitjes" className="py-20">
                        <div className="text-center mb-16 animate-fade-in-up">
                            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-warm-700 tracking-tight">
                                Onze Laatste Avonturen
                            </h2>
                            <p className="text-lg text-warm-600 max-w-2xl mx-auto leading-relaxed">
                                Kijk mee waar we zoal terechtkwamen tijdens onze spontane ontdekkingen
                            </p>
                        </div>

                        {/* Category Navigation */}
                        <div className="flex flex-wrap justify-center gap-3 mb-16 animate-fade-in-up">
                            {activeCategory && (
                                <button
                                    onClick={() => router.get('/', {}, { preserveScroll: false })}
                                    className="px-6 py-3 rounded-full bg-warm-700 text-white text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                                >
                                    ✕ Alles tonen
                                </button>
                            )}
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryClick(category)}
                                    className={`px-6 py-3 rounded-full border text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                                        activeCategory === category
                                            ? 'bg-warm-700 text-white border-warm-700 shadow-md'
                                            : 'bg-white border-warm-300 hover:border-warm-500 hover:shadow-md text-warm-700'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Outings Grid */}
                        {latestOutings.length === 0 ? (
                            <div className="text-center py-20 animate-fade-in-up">
                                <div className="w-24 h-24 mx-auto mb-6 text-warm-400">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <p className="text-warm-500 text-lg mb-4">
                                    Geen uitjes gevonden in <strong className="text-warm-700">{activeCategory}</strong>.
                                </p>
                                <button
                                    onClick={() => router.get('/', {}, { preserveScroll: false })}
                                    className="btn-primary"
                                >
                                    Alle uitjes bekijken
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {latestOutings.map((outing, index) => (
                                    <div 
                                        key={outing.id}
                                        className="animate-fade-in-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <OutingCard outing={outing} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Blog Section */}
                    {latestPosts.length > 0 && (
                        <section className="py-20">
                            <div className="text-center mb-16 animate-fade-in-up">
                                <h2 className="text-4xl md:text-5xl font-serif mb-6 text-warm-700 tracking-tight">
                                    Van de Blog
                                </h2>
                                <p className="text-lg text-warm-600 max-w-2xl mx-auto leading-relaxed">
                                    Verhalen, tips en gedachten uit ons gezinsleven onderweg
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {latestPosts.map((post, index) => (
                                    <Link
                                        key={post.id}
                                        href={`/blog/${post.slug}`}
                                        className="card group overflow-hidden hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {post.featured_image ? (
                                            <div className="aspect-video overflow-hidden">
                                                <img
                                                    src={post.featured_image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-warm-100 flex items-center justify-center">
                                                <svg className="w-12 h-12 text-warm-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="p-6">
                                            {post.published_at && (
                                                <p className="text-xs text-warm-500 uppercase tracking-wider mb-2">
                                                    {new Date(post.published_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            )}
                                            <h3 className="font-serif text-xl text-warm-700 mb-3 group-hover:text-warm-800 transition-colors leading-snug">
                                                {post.title}
                                            </h3>
                                            {post.excerpt && (
                                                <p className="text-warm-600 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                                            )}
                                            <span className="inline-block mt-4 text-sm font-medium text-warm-700 group-hover:text-warm-800 transition-colors">
                                                Lees meer →
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="text-center mt-10 animate-fade-in-up">
                                <Link
                                    href="/blog"
                                    className="px-8 py-3 border-2 border-warm-400 text-warm-700 rounded-full font-medium hover:bg-warm-700 hover:text-white hover:border-warm-700 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    Alle blogs bekijken
                                </Link>
                            </div>
                        </section>
                    )}

                    {/* Recent Discoveries Section */}
                    {newDiscoveries.length > 0 && (
                        <section className="py-20">
                            <div className="text-center mb-16 animate-fade-in-up">
                                <h2 className="text-4xl md:text-5xl font-serif mb-6 text-warm-700 tracking-tight">
                                    Nieuwste Ontdekkingen
                                </h2>
                                <p className="text-lg text-warm-600 max-w-2xl mx-auto leading-relaxed">
                                    De kleine en grote dingen die ons opvielen tijdens onze uitjes
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {newDiscoveries.slice(0, 8).map((discovery, index) => (
                                    <Link
                                        key={discovery.id}
                                        href={`/ontdekkingen/${discovery.slug || discovery.id}`}
                                        className="card p-6 text-center animate-fade-in-up hover:shadow-lg transition-all duration-300 group cursor-pointer"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {discovery.image && (
                                            <img 
                                                src={discovery.image} 
                                                alt={discovery.title}
                                                className="w-16 h-16 object-cover rounded-xl mx-auto mb-4 group-hover:scale-105 transition-transform duration-300"
                                            />
                                        )}
                                        <h3 className="font-serif text-lg text-warm-700 mb-2 group-hover:text-warm-800 transition-colors">{discovery.title}</h3>
                                        <p className="text-sm text-warm-600 mb-3">{discovery.description}</p>
                                        <span className="text-xs text-warm-500 uppercase tracking-wider">{discovery.type}</span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Call to Action */}
                <section className="bg-warm-700 text-white py-20">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-4xl md:text-5xl font-serif mb-6 animate-fade-in-up">
                            Klaar voor je eigen avontuur?
                        </h2>
                        <p className="text-xl opacity-90 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Laat je inspireren door onze verhalen en ga zelf op ontdekking
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <Link 
                                href="/uitjes" 
                                className="px-8 py-4 bg-white text-warm-700 rounded-full font-medium hover:bg-warm-50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                            >
                                Bekijk Alle Uitjes
                            </Link>
                            <Link 
                                href="/over-ons" 
                                className="px-8 py-4 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-warm-700 transition-all duration-300 hover:-translate-y-1"
                            >
                                Ons Verhaal
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-warm-800 text-warm-200 py-16">
                    <div className="max-w-7xl mx-auto px-6">
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
                                    <li><Link href="/uitjes" className="hover:text-white transition-colors">Alle Uitjes</Link></li>
                                    <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                                    <li><Link href="/over-ons" className="hover:text-white transition-colors">Over Ons</Link></li>
                                    <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
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