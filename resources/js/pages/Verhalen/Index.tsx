import Navigation from '@/Components/Navigation';
import Seo from '@/Components/Seo';
import { Link } from '@inertiajs/react';

interface Story {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    featured_image: string | null;
    published_at: string | null;
}

interface Props {
    stories: Story[];
}

export default function VerhalenIndex({ stories }: Props) {
    const siteUrl = window.location.origin;

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Verhalen – De Ongeplande Route',
        url: `${siteUrl}/verhalen`,
        description: 'Verhalen en avonturen van De Ongeplande Route.',
        blogPost: stories.map((story) => ({
            '@type': 'BlogPosting',
            headline: story.title,
            url: `${siteUrl}/verhalen/${story.slug}`,
            datePublished: story.published_at ?? undefined,
        })),
    };

    return (
        <>
            <Seo
                title="Verhalen – Onze Avonturen"
                description="Lees de verhalen en avonturen van De Ongeplande Route. Van dag-uitjes tot bijzondere ontdekkingen."
                url={`${siteUrl}/verhalen`}
                structuredData={structuredData}
            />
            <Navigation variant="page" />

            <main className="min-h-screen bg-warm-50">
                {/* Header */}
                <div className="bg-white border-b border-warm-200">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                        <h1 className="text-4xl font-serif font-bold text-warm-800">Verhalen</h1>
                        <p className="mt-2 text-warm-500 text-lg">
                            {stories.length === 1
                                ? '1 verhaal gedeeld'
                                : `${stories.length} verhalen gedeeld`} op De Ongeplande Route
                        </p>
                    </div>
                </div>

                {/* Grid */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                    {stories.length === 0 ? (
                        <div className="text-center py-20">
                            <span className="text-6xl block mb-4">✍️</span>
                            <p className="text-warm-400 text-lg">Nog geen verhalen gepubliceerd.</p>
                            <p className="text-warm-300 text-sm mt-1">Kom snel terug voor nieuwe verhalen!</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stories.map((story) => (
                                <Link
                                    key={story.id}
                                    href={`/verhalen/${story.slug}`}
                                    className="group bg-white rounded-2xl border border-warm-200 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                                >
                                    <div className="aspect-[4/3] overflow-hidden bg-warm-100">
                                        {story.featured_image ? (
                                            <img
                                                src={story.featured_image}
                                                alt={story.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-4xl">✍️</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h2 className="font-serif text-lg font-bold text-warm-800 group-hover:text-amber-700 transition leading-snug mb-2">
                                            {story.title}
                                        </h2>
                                        {story.description && (
                                            <p className="text-warm-500 text-sm leading-relaxed line-clamp-2 mb-3">
                                                {story.description}
                                            </p>
                                        )}
                                        {story.published_at && (
                                            <p className="text-warm-400 text-xs">
                                                {new Date(story.published_at).toLocaleDateString('nl-NL', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
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
