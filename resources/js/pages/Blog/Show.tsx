import Navigation from '@/Components/Navigation';
import Seo from '@/Components/Seo';
import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition z-10"
                aria-label="Sluiten"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <img
                src={src}
                alt=""
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                style={{ touchAction: 'pinch-zoom' }}
            />
        </div>
    );
}

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    youtube_url: string | null;
    featured_image: string | null;
    published_at: string | null;
}

interface Props {
    post: Post;
}

function getYoutubeEmbedUrl(url: string): string | null {
    try {
        const parsed = new URL(url);
        let videoId: string | null = null;
        if (parsed.hostname === 'youtu.be') {
            videoId = parsed.pathname.slice(1);
        } else if (parsed.hostname.includes('youtube.com')) {
            videoId = parsed.searchParams.get('v');
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch {
        return null;
    }
}

export default function BlogShow({ post }: Props) {
    const siteUrl = window.location.origin;
    const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
    const description = post.excerpt ?? `Lees het verhaal "${post.title}" van De Ongeplande Route.`;
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const articleRef = useRef<HTMLElement>(null);

    // Click delegation for images inside the rendered HTML content
    useEffect(() => {
        const el = articleRef.current;
        if (!el) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG') {
                const src = (target as HTMLImageElement).src;
                if (src) setLightboxSrc(src);
            }
        };
        el.addEventListener('click', handler);
        return () => el.removeEventListener('click', handler);
    }, [post.content]);

    const structuredData = [
        {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description,
            url: canonicalUrl,
            image: post.featured_image ?? undefined,
            datePublished: post.published_at ?? undefined,
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
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
                { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
            ],
        },
    ];

    const embedUrl = post.youtube_url ? getYoutubeEmbedUrl(post.youtube_url) : null;

    return (
        <>
            <Seo
                title={post.title}
                description={description}
                image={post.featured_image ?? undefined}
                url={canonicalUrl}
                type="article"
                publishedAt={post.published_at ?? undefined}
                structuredData={structuredData}
            />

            <div className="min-h-screen bg-warm-bg">
                <Navigation variant="page" />

                {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}

                {/* Hero */}
                <div className="max-w-3xl mx-auto px-6 py-10">
                    {/* Back link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm text-warm-500 hover:text-warm-700 transition mb-8"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Terug naar Blog
                    </Link>

                    {/* Featured image */}
                    {post.featured_image && (
                        <button
                            type="button"
                            onClick={() => setLightboxSrc(post.featured_image!)}
                            className="w-full rounded-3xl overflow-hidden shadow-xl mb-8 aspect-[16/9] block cursor-zoom-in"
                        >
                            <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    )}

                    {/* Title & meta */}
                    <header className="mb-10">
                        <h1 className="font-serif text-4xl md:text-5xl text-warm-800 leading-tight mb-4">
                            {post.title}
                        </h1>
                        {post.published_at && (
                            <p className="text-sm text-warm-400">
                                Gepubliceerd op{' '}
                                {new Date(post.published_at).toLocaleDateString('nl-NL', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                        )}
                        {post.excerpt && (
                            <p className="mt-4 text-lg text-warm-600 leading-relaxed border-l-4 border-amber-400 pl-4">
                                {post.excerpt}
                            </p>
                        )}
                    </header>

                    {/* YouTube embed */}
                    {embedUrl && (
                        <div className="mb-10 rounded-2xl overflow-hidden shadow-lg aspect-video">
                            <iframe
                                src={embedUrl}
                                className="w-full h-full"
                                title={`YouTube video bij ${post.title}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    )}

                    {/* Post content (rich HTML from RichTextEditor) */}
                    {post.content && (
                        <article
                            ref={articleRef}
                            className="prose prose-stone max-w-none prose-p:text-warm-700 prose-headings:text-warm-800 prose-headings:font-serif prose-a:text-amber-600 prose-strong:text-warm-800 prose-blockquote:border-amber-400 prose-blockquote:text-warm-600 leading-relaxed text-lg mb-12 [&_img]:cursor-zoom-in [&_img]:transition [&_img]:hover:opacity-90"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    )}

                    {/* Footer nav */}
                    <div className="border-t border-warm-200 pt-8">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-warm-600 hover:text-warm-800 font-medium transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Alle blogposts
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
