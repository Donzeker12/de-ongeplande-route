import Navigation from '@/Components/Navigation';
import Seo from '@/Components/Seo';
import { Link } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

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

function GallerySlider({ images, onOpenLightbox }: { images: string[]; onOpenLightbox: (src: string) => void }) {
    const [current, setCurrent] = useState(0);
    const touchStartX = useRef<number | null>(null);

    const prev = useCallback(() => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1)), [images.length]);
    const next = useCallback(() => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1)), [images.length]);

    // Keyboard arrows
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [prev, next]);

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            diff > 0 ? next() : prev();
        }
        touchStartX.current = null;
    };

    return (
        <div className="my-10">
            <h2 className="font-serif text-2xl text-warm-800 mb-5">Foto's</h2>

            {/* Main image */}
            <div
                className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-warm-100 select-none"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                {images.map((src, idx) => (
                    <button
                        key={src}
                        type="button"
                        onClick={() => onOpenLightbox(src)}
                        className={`absolute inset-0 w-full h-full cursor-zoom-in transition-opacity duration-500 ${
                            idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                        aria-label="Vergroot foto"
                    >
                        <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                ))}

                {/* Arrows */}
                <button
                    type="button"
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition backdrop-blur-sm"
                    aria-label="Vorige foto"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition backdrop-blur-sm"
                    aria-label="Volgende foto"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Counter badge */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
                    {current + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 snap-x">
                {images.map((src, idx) => (
                    <button
                        key={src}
                        type="button"
                        onClick={() => setCurrent(idx)}
                        className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition snap-start ${
                            idx === current
                                ? 'border-amber-400 opacity-100'
                                : 'border-transparent opacity-60 hover:opacity-90'
                        }`}
                        aria-label={`Foto ${idx + 1}`}
                    >
                        <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
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
    library_video_url: string | null;
    featured_image: string | null;
    gallery_images: string[] | null;
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
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
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

                    {/* Library video */}
                    {post.library_video_url && (
                        <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
                            <video
                                src={post.library_video_url}
                                controls
                                className="w-full rounded-2xl bg-black"
                                preload="metadata"
                            />
                        </div>
                    )}

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

                    {/* Gallery slider — only when 2+ images */}
                    {post.gallery_images && post.gallery_images.length >= 2 && (
                        <GallerySlider
                            images={post.gallery_images}
                            onOpenLightbox={setLightboxSrc}
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
