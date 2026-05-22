import Navigation from '@/Components/Navigation';
import Seo from '@/Components/Seo';
import { Link } from '@inertiajs/react';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    featured_image: string | null;
    published_at: string | null;
}

interface Props {
    posts: Post[];
}

export default function BlogIndex({ posts }: Props) {
    const siteUrl = window.location.origin;

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Blog – De Ongeplande Route',
        url: `${siteUrl}/blog`,
        description: 'Verhalen en avonturen van De Ongeplande Route.',
        blogPost: posts.map((post) => ({
            '@type': 'BlogPosting',
            headline: post.title,
            url: `${siteUrl}/blog/${post.slug}`,
            datePublished: post.published_at ?? undefined,
        })),
    };

    return (
        <>
            <Seo
                title="Blog – Onze Verhalen"
                description="Lees de verhalen en avonturen van De Ongeplande Route. Van dag-uitjes tot bijzondere ontdekkingen."
                url={`${siteUrl}/blog`}
                structuredData={structuredData}
            />
            <Navigation variant="page" />

            <main className="min-h-screen bg-warm-50">
                {/* Header */}
                <div className="bg-white border-b border-warm-200">
                    <div className="max-w-5xl mx-auto px-6 py-10">
                        <h1 className="text-4xl font-serif font-bold text-warm-800">Blog</h1>
                        <p className="mt-2 text-warm-500 text-lg">
                            {posts.length === 1
                                ? '1 verhaal gedeeld'
                                : `${posts.length} verhalen gedeeld`} op De Ongeplande Route
                        </p>
                    </div>
                </div>

                {/* Grid */}
                <div className="max-w-5xl mx-auto px-6 py-10">
                    {posts.length === 0 ? (
                        <div className="text-center py-20">
                            <span className="text-6xl block mb-4">✍️</span>
                            <p className="text-warm-400 text-lg">Nog geen blogposts gepubliceerd.</p>
                            <p className="text-warm-300 text-sm mt-1">Kom snel terug voor nieuwe verhalen!</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="group bg-white rounded-2xl border border-warm-200 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                                >
                                    {/* Image */}
                                    <div className="aspect-[4/3] overflow-hidden bg-warm-100">
                                        {post.featured_image ? (
                                            <img
                                                src={post.featured_image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-5xl opacity-20">📖</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h2 className="font-serif font-semibold text-warm-800 text-lg leading-tight group-hover:text-amber-700 transition">
                                            {post.title}
                                        </h2>
                                        {post.excerpt && (
                                            <p className="mt-2 text-sm text-warm-500 line-clamp-2 leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        {post.published_at && (
                                            <p className="mt-3 text-xs text-warm-300">
                                                {new Date(post.published_at).toLocaleDateString('nl-NL', {
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
