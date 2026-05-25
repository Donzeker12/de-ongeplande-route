import Seo from '@/Components/Seo';
import Navigation from '@/Components/Navigation';

interface OverOnsContent {
    hero_title: string;
    hero_intro: string;
    hero_image: string;
    hero_year: string;
    mission_title: string;
    mission_text: string;
    pillar_1_title: string;
    pillar_1_text: string;
    pillar_2_title: string;
    pillar_2_text: string;
    pillar_3_title: string;
    pillar_3_text: string;
    story_title: string;
    story_image: string;
    story_text: string;
    cta_title: string;
    cta_text: string;
}

interface Props {
    content: OverOnsContent;
}

export default function OverOns({ content }: Props) {

    return (
        <>
            <Seo
                title={content.hero_title}
                description="Wij zijn een familie die van spontaniteit houdt. Geen uitgebreide planningen, geen stress. Gewoon instappen en kijken waar de weg ons brengt. Ontdek ons verhaal."
            />

            <div className="min-h-screen bg-warm-bg">
                <Navigation />

                {/* Hero Section */}
                <section className="relative py-20 lg:py-32 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                            <div className="animate-fade-in-up">
                                <h1 className="text-5xl md:text-6xl font-serif text-warm-700 mb-8 leading-tight">
                                    {content.hero_title}
                                </h1>
                                <p className="text-xl text-warm-600 mb-8 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: content.hero_intro }}
                                />
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-0.5 bg-warm-400"></div>
                                    <span className="text-sm text-warm-500 uppercase tracking-wider font-medium">
                                        {content.hero_year}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="mt-12 lg:mt-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <div className="relative">
                                    <img
                                        src={content.hero_image}
                                        alt="Familie onderweg"
                                        className="rounded-3xl shadow-2xl w-full"
                                    />
                                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent-500 rounded-full flex items-center justify-center shadow-xl">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <div className="animate-fade-in-up">
                            <h2 className="text-4xl font-serif text-warm-700 mb-8">{content.mission_title}</h2>
                            <div className="text-xl text-warm-600 leading-relaxed mb-12"
                                dangerouslySetInnerHTML={{ __html: content.mission_text }}
                            />
                            
                            <div className="grid md:grid-cols-3 gap-8 mt-16">
                                <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                    <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-serif text-xl text-warm-700 mb-3">{content.pillar_1_title}</h3>
                                    <div className="text-warm-600" dangerouslySetInnerHTML={{ __html: content.pillar_1_text }} />
                                </div>
                                
                                <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                    <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-serif text-xl text-warm-700 mb-3">{content.pillar_2_title}</h3>
                                    <div className="text-warm-600" dangerouslySetInnerHTML={{ __html: content.pillar_2_text }} />
                                </div>
                                
                                <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                    <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-serif text-xl text-warm-700 mb-3">{content.pillar_3_title}</h3>
                                    <div className="text-warm-600" dangerouslySetInnerHTML={{ __html: content.pillar_3_text }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-20">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                            <div className="animate-fade-in-up">
                                <img
                                    src={content.story_image}
                                    alt="Roadtrip avontuur"
                                    className="rounded-3xl shadow-2xl w-full"
                                />
                            </div>
                            
                            <div className="mt-12 lg:mt-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <h2 className="text-4xl font-serif text-warm-700 mb-8">
                                    {content.story_title}
                                </h2>
                                <div className="space-y-6 text-warm-600 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: content.story_text }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-warm-700 text-white">
                    <div className="max-w-4xl mx-auto px-6 text-center animate-fade-in-up">
                        <h2 className="text-4xl md:text-5xl font-serif mb-6">
                            {content.cta_title}
                        </h2>
                        <div className="text-xl opacity-90 mb-8 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: content.cta_text }}
                        />
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a 
                                href="/#uitjes" 
                                className="px-8 py-4 bg-white text-warm-700 rounded-full font-medium hover:bg-warm-50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                            >
                                Bekijk Onze Uitjes
                            </a>
                            <a 
                                href="/contact" 
                                className="px-8 py-4 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-warm-700 transition-all duration-300 hover:-translate-y-1"
                            >
                                Neem Contact Op
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
