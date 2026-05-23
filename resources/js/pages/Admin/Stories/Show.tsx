import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

interface Chapter {
    id: number;
    title: string;
    content: string;
    order: number;
}

interface Story {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    content: string | null;
    generated_content: string | null;
    featured_image: string | null;
    gallery_images: string[] | null;
    youtube_url: string | null;
    status: 'draft' | 'generating' | 'completed' | 'published';
    published_at: string | null;
    created_at: string;
    chapters: Chapter[];
}

interface Props {
    story: Story;
}

function getYouTubeEmbed(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function StoryShow({ story }: Props) {
    const displayContent = story.content || story.generated_content;

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/stories"
                            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Verhalen
                        </Link>
                        <span className="text-gray-600">/</span>
                        <span className="text-gray-300 text-sm truncate max-w-xs">{story.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {story.slug && (
                            <a
                                href={`/verhalen/${story.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Publieke pagina
                            </a>
                        )}
                        <Link
                            href={`/admin/stories/${story.id}/edit`}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Bijwerken
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Preview: ${story.title}`} />

            <div className="min-h-screen bg-[#0d0f14]">
                {/* Featured Image */}
                {story.featured_image && (
                    <div className="w-full max-h-[420px] overflow-hidden">
                        <img
                            src={story.featured_image}
                            alt={story.title}
                            className="w-full object-cover max-h-[420px]"
                        />
                    </div>
                )}

                <div className="max-w-3xl mx-auto px-6 py-10">
                    {/* Status */}
                    <div className="flex items-center gap-3 mb-6">
                        {story.status === 'published' ? (
                            <span className="px-3 py-1 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-medium">🚀 Gepubliceerd</span>
                        ) : story.status === 'completed' ? (
                            <span className="px-3 py-1 bg-green-600/20 text-green-400 border border-green-500/30 rounded-full text-xs font-medium">✅ Voltooid</span>
                        ) : story.status === 'generating' ? (
                            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-medium">🤖 Genereren...</span>
                        ) : (
                            <span className="px-3 py-1 bg-gray-600/20 text-gray-400 border border-gray-500/30 rounded-full text-xs font-medium">📝 Concept</span>
                        )}
                        {story.published_at && (
                            <span className="text-xs text-gray-500">
                                {new Date(story.published_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-tight">
                        {story.title}
                    </h1>

                    {/* Description */}
                    {story.description && (
                        <p className="text-lg text-gray-300 leading-relaxed mb-8 border-l-4 border-emerald-500/40 pl-4 italic">
                            {story.description}
                        </p>
                    )}

                    {/* YouTube */}
                    {story.youtube_url && getYouTubeEmbed(story.youtube_url) && (
                        <div className="mb-8 aspect-video rounded-xl overflow-hidden">
                            <iframe
                                src={getYouTubeEmbed(story.youtube_url)!}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="YouTube video"
                            />
                        </div>
                    )}

                    {/* Content */}
                    {displayContent ? (
                        <div
                            className="prose prose-invert prose-lg max-w-none mb-10
                                prose-headings:font-serif prose-headings:text-white
                                prose-p:text-gray-300 prose-p:leading-relaxed
                                prose-a:text-emerald-400 prose-strong:text-white
                                prose-ul:text-gray-300 prose-ol:text-gray-300
                                prose-blockquote:border-emerald-500 prose-blockquote:text-gray-400"
                            dangerouslySetInnerHTML={{ __html: displayContent }}
                        />
                    ) : story.chapters.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <p className="text-lg mb-2">Nog geen inhoud</p>
                            <p className="text-sm">Voeg inhoud toe of genereer via AI in het bewerkscherm.</p>
                        </div>
                    ) : null}

                    {/* Chapters */}
                    {story.chapters.length > 0 && (
                        <div className="space-y-8 mb-10">
                            <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-3">
                                Hoofdstukken ({story.chapters.length})
                            </h2>
                            {story.chapters
                                .sort((a, b) => a.order - b.order)
                                .map((chapter) => (
                                    <div key={chapter.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                                        <h3 className="text-lg font-semibold text-white mb-3">{chapter.title}</h3>
                                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">{chapter.content}</p>
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* Gallery */}
                    {story.gallery_images && story.gallery_images.length > 0 && (
                        <div className="mb-10">
                            <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-3 mb-4">
                                Galerij ({story.gallery_images.length} foto's)
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {story.gallery_images.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt={`Foto ${i + 1}`}
                                        className="rounded-lg w-full aspect-square object-cover"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bottom actions */}
                    <div className="flex items-center justify-between pt-8 border-t border-gray-800">
                        <Link
                            href="/admin/stories"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Terug naar verhalen
                        </Link>
                        <Link
                            href={`/admin/stories/${story.id}/edit`}
                            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Bijwerken
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
