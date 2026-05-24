import Navigation from '@/Components/Navigation';
import Seo from '@/Components/Seo';
import { Link } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

function Lightbox({
    images, index, onClose, onNavigate,
}: {
    images: string[]; index: number; onClose: () => void; onNavigate: (index: number) => void;
}) {
    const src = images[index];
    const hasMultiple = images.length > 1;
    const prev = useCallback(() => onNavigate(index === 0 ? images.length - 1 : index - 1), [index, images.length, onNavigate]);
    const next = useCallback(() => onNavigate(index === images.length - 1 ? 0 : index + 1), [index, images.length, onNavigate]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft' && hasMultiple) prev();
            if (e.key === 'ArrowRight' && hasMultiple) next();
        };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
    }, [onClose, prev, next, hasMultiple]);

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition z-10" aria-label="Sluiten">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {hasMultiple && (
                <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/70 text-white rounded-full transition backdrop-blur-sm z-10" aria-label="Vorige foto">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
            )}
            <img src={src} alt="" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} style={{ touchAction: 'pinch-zoom' }} />
            {hasMultiple && (
                <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/70 text-white rounded-full transition backdrop-blur-sm z-10" aria-label="Volgende foto">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            )}
            {hasMultiple && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 text-white text-sm rounded-full backdrop-blur-sm">{index + 1} / {images.length}</div>
            )}
        </div>
    );
}

function GallerySlider({ images, onOpenLightbox }: { images: string[]; onOpenLightbox: (index: number) => void }) {
    const [current, setCurrent] = useState(0);
    const touchStartX = useRef<number | null>(null);
    const prev = useCallback(() => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1)), [images.length]);
    const next = useCallback(() => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1)), [images.length]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [prev, next]);

    return (
        <div className="my-10">
            <h2 className="font-serif text-2xl text-warm-800 mb-5">Foto&apos;s</h2>
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] bg-warm-100 select-none"
                onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                onTouchEnd={(e) => {
                    if (touchStartX.current === null) return;
                    const diff = touchStartX.current - e.changedTouches[0].clientX;
                    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); }
                    touchStartX.current = null;
                }}
            >
                {images.map((src, idx) => (
                    <button key={src} type="button" onClick={() => onOpenLightbox(idx)} className={`absolute inset-0 w-full h-full cursor-zoom-in transition-opacity duration-500 ${idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-label="Vergroot foto">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                ))}
                <button type="button" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition backdrop-blur-sm" aria-label="Vorige foto">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button type="button" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition backdrop-blur-sm" aria-label="Volgende foto">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">{current + 1} / {images.length}</div>
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 snap-x">
                {images.map((src, idx) => (
                    <button key={src} type="button" onClick={() => setCurrent(idx)} className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition snap-start ${idx === current ? 'border-amber-400 opacity-100' : 'border-transparent opacity-60 hover:opacity-90'}`} aria-label={`Foto ${idx + 1}`}>
                        <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}

interface Story {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    content: string | null;
    generated_content: string | null;
    youtube_url: string | null;
    library_video_url: string | null;
    featured_image: string | null;
    gallery_images: string[] | null;
    published_at: string | null;
    venues: {
        id: number;
        name: string;
        slug: string;
        type_label: string;
        type_emoji: string;
        city: string | null;
        featured_image: string | null;
    }[];
}

interface Props { story: Story; }

function getYoutubeEmbedUrl(url: string): string | null {
    try {
        const parsed = new URL(url);
        let videoId: string | null = null;
        if (parsed.hostname === 'youtu.be') { videoId = parsed.pathname.slice(1); }
        else if (parsed.hostname.includes('youtube.com')) { videoId = parsed.searchParams.get('v'); }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch { return null; }
}

export default function VerhaalShow({ story }: Props) {
    const siteUrl = window.location.origin;
    const canonicalUrl = `${siteUrl}/verhalen/${story.slug}`;
    const description = story.description ?? `Lees het verhaal "${story.title}" van De Ongeplande Route.`;
    const [lightboxState, setLightboxState] = useState<{ images: string[]; index: number } | null>(null);
    const articleRef = useRef<HTMLElement>(null);

    const openLightbox = useCallback((images: string[], index: number) => setLightboxState({ images, index }), []);

    useEffect(() => {
        const el = articleRef.current;
        if (!el) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG') { const src = (target as HTMLImageElement).src; if (src) openLightbox([src], 0); }
        };
        el.addEventListener('click', handler);
        return () => el.removeEventListener('click', handler);
    }, [story.content, story.generated_content, openLightbox]);

    const structuredData = [
        { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: story.title, description, url: canonicalUrl, image: story.featured_image ?? undefined, datePublished: story.published_at ?? undefined, author: { '@type': 'Organization', name: 'De Ongeplande Route', url: siteUrl } },
        { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }, { '@type': 'ListItem', position: 2, name: 'Verhalen', item: `${siteUrl}/verhalen` }, { '@type': 'ListItem', position: 3, name: story.title, item: canonicalUrl }] },
    ];

    const embedUrl = story.youtube_url ? getYoutubeEmbedUrl(story.youtube_url) : null;
    // Show the best available content: manual content takes precedence, then AI content
    const displayContent = story.content || story.generated_content;

    return (
        <>
            <Seo title={story.title} description={description} image={story.featured_image ?? undefined} url={canonicalUrl} type="article" publishedAt={story.published_at ?? undefined} structuredData={structuredData} />

            <div className="min-h-screen bg-warm-bg">
                <Navigation variant="page" />

                {lightboxState && (
                    <Lightbox images={lightboxState.images} index={lightboxState.index} onClose={() => setLightboxState(null)} onNavigate={(i) => setLightboxState((s) => s ? { ...s, index: i } : null)} />
                )}

                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                    <Link href="/verhalen" className="inline-flex items-center gap-2 text-sm text-warm-500 hover:text-warm-700 transition mb-8">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Terug naar Verhalen
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Main content */}
                        <div className="flex-1 min-w-0">
                            {/* Featured image */}
                            {story.featured_image && (
                                <button type="button" onClick={() => openLightbox([story.featured_image!], 0)} className="w-full rounded-3xl overflow-hidden shadow-xl mb-8 aspect-[16/9] block cursor-zoom-in">
                                    <img src={story.featured_image} alt={story.title} className="w-full h-full object-cover" />
                                </button>
                            )}

                            {/* Title & meta */}
                            <header className="mb-10">
                                <h1 className="font-serif text-4xl md:text-5xl text-warm-800 leading-tight mb-4">{story.title}</h1>
                                {story.published_at && (
                                    <p className="text-sm text-warm-400">Gepubliceerd op{' '}{new Date(story.published_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                )}
                                {story.description && (
                                    <p className="mt-4 text-lg text-warm-600 leading-relaxed border-l-4 border-amber-400 pl-4">{story.description}</p>
                                )}
                            </header>

                            {/* Library video */}
                            {story.library_video_url && (
                                <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
                                    <video src={story.library_video_url} controls className="w-full rounded-2xl bg-black" preload="metadata" />
                                </div>
                            )}

                            {/* YouTube embed */}
                            {embedUrl && (
                                <div className="mb-10 rounded-2xl overflow-hidden shadow-lg aspect-video">
                                    <iframe src={embedUrl} className="w-full h-full" title={`YouTube video bij ${story.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                                </div>
                            )}

                            {/* Story content */}
                            {displayContent && (
                                <article
                                    ref={articleRef}
                                    className="prose prose-stone max-w-none prose-p:text-warm-700 prose-headings:text-warm-800 prose-headings:font-serif prose-a:text-amber-600 prose-strong:text-warm-800 prose-blockquote:border-amber-400 prose-blockquote:text-warm-600 leading-relaxed text-lg mb-12 [&_img]:cursor-zoom-in [&_img]:transition [&_img]:hover:opacity-90 whitespace-pre-line"
                                    dangerouslySetInnerHTML={{ __html: displayContent }}
                                />
                            )}

                            {/* Gallery */}
                            {story.gallery_images && story.gallery_images.length >= 1 && (
                                <GallerySlider images={story.gallery_images} onOpenLightbox={(i) => openLightbox(story.gallery_images!, i)} />
                            )}

                            <div className="border-t border-warm-200 pt-8">
                                <Link href="/verhalen" className="inline-flex items-center gap-2 text-warm-600 hover:text-warm-800 font-medium transition">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                    Alle verhalen
                                </Link>
                            </div>
                        </div>

                        {/* Sidebar — locaties */}
                        {story.venues && story.venues.length > 0 && (
                            <aside className="lg:w-72 shrink-0">
                                <div className="lg:sticky lg:top-8 space-y-4">
                                    <h2 className="text-xs font-semibold uppercase tracking-wider text-warm-400">Locaties in dit verhaal</h2>
                                    {story.venues.map((venue) => (
                                        <Link
                                            key={venue.id}
                                            href={`/locaties/${venue.slug}`}
                                            className="group block bg-white rounded-2xl shadow-sm border border-warm-100 overflow-hidden hover:shadow-md hover:border-amber-200 transition"
                                        >
                                            {venue.featured_image ? (
                                                <div className="aspect-[16/9] overflow-hidden">
                                                    <img
                                                        src={venue.featured_image}
                                                        alt={venue.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="aspect-[16/9] bg-gradient-to-br from-warm-100 to-warm-200 flex items-center justify-center">
                                                    <span className="text-4xl opacity-50">{venue.type_emoji}</span>
                                                </div>
                                            )}
                                            <div className="p-4">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <span className="text-sm">{venue.type_emoji}</span>
                                                    <span className="text-xs text-warm-400">{venue.type_label}</span>
                                                </div>
                                                <h3 className="font-serif text-warm-800 font-semibold leading-snug">{venue.name}</h3>
                                                {venue.city && (
                                                    <p className="text-xs text-warm-500 mt-0.5 flex items-center gap-1">
                                                        <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        {venue.city}
                                                    </p>
                                                )}
                                                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-600 group-hover:text-amber-700 transition">
                                                    Meer info
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </aside>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
