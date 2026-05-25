import AdminLayout from '@/Layouts/AdminLayout';
import GalleryPicker from '@/Components/GalleryPicker';
import VideoPicker from '@/Components/VideoPicker';
import ImageUpload from '@/Components/ImageUpload';
import RichTextEditor from '@/Components/RichTextEditor';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { shareInstagram, shareFacebook } from '@/actions/App/Http/Controllers/Admin/StoryController';

interface MediaImage { id: number; url: string; filename: string; }
interface MediaVideo { id: number; url: string; filename: string; }
interface Chapter { id?: number; title: string; content: string; order: number; }
interface VenueOption { id: number; name: string; type: string; city: string | null; }

interface Story {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    content: string | null;
    featured_image: string | null;
    gallery_images: string[] | null;
    youtube_url: string | null;
    library_video_url: string | null;
    status: 'draft' | 'generating' | 'completed' | 'published';
    published_at: string | null;
    ai_settings: { tone: string; length: string; style: string } | null;
    generated_content: string | null;
    chapters: Chapter[];
    venues: VenueOption[];
}

interface FormData {
    title: string;
    slug: string;
    description: string;
    content: string;
    featured_image: string;
    gallery_images: string[];
    youtube_url: string;
    library_video_url: string;
    status: 'draft' | 'published';
    ai_settings: { tone: string; length: string; style: string };
    chapters: Chapter[];
    venue_ids: number[];
    [key: string]: unknown;
}

interface Props {
    story: Story;
    mediaImages: MediaImage[];
    mediaVideos: MediaVideo[];
    allVenues: VenueOption[];
}

function getYoutubeEmbedUrl(url: string): string | null {
    try {
        const parsed = new URL(url);
        let videoId: string | null = null;
        if (parsed.hostname === 'youtu.be') { videoId = parsed.pathname.slice(1); }
        else if (parsed.hostname.includes('youtube.com')) { videoId = parsed.searchParams.get('v'); }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch { return null; }
}

export default function StoryEdit({ story, mediaImages, mediaVideos, allVenues }: Props) {
    const publishedStatus = (story.status === 'published') ? 'published' : 'draft';

    const { data, setData, put, processing, errors } = useForm<FormData>({
        title: story.title,
        slug: story.slug ?? '',
        description: story.description ?? '',
        content: story.content ?? '',
        featured_image: story.featured_image ?? '',
        gallery_images: story.gallery_images ?? [],
        youtube_url: story.youtube_url ?? '',
        library_video_url: story.library_video_url ?? '',
        status: publishedStatus,
        ai_settings: story.ai_settings ?? { tone: 'vriendelijk', length: 'medium', style: 'verhaal' },
        chapters: story.chapters ?? [],
        venue_ids: (story.venues ?? []).map((v) => v.id),
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('admin.stories.update', story.id));
    };

    const handleDelete = () => {
        if (confirm(`Weet je zeker dat je "${story.title}" wilt verwijderen?`)) {
            router.delete(route('admin.stories.destroy', story.id));
        }
    };

    const embedUrl = data.youtube_url ? getYoutubeEmbedUrl(data.youtube_url) : null;

    return (
        <AdminLayout header={
            <div className="flex items-center justify-between w-full">
                <h2 className="text-lg font-semibold text-white">Verhaal bewerken</h2>
                <div className="flex items-center gap-2">
                    {story.status === 'published' && story.slug && (
                        <a href={`/verhalen/${story.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 p-2 sm:px-4 sm:py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition text-sm">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            <span className="hidden sm:inline">Bekijken</span>
                        </a>
                    )}
                    <Link href="/admin/stories" className="flex items-center gap-1.5 p-2 sm:px-4 sm:py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition text-sm">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        <span className="hidden sm:inline">Terug</span>
                    </Link>
                </div>
            </div>
        }>
            <Head title={`Bewerken: ${story.title}`} />

            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Left */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Algemeen */}
                                <div className="bg-[#16181f] rounded-xl p-6 border border-gray-800">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">Algemeen</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Titel *</label>
                                            <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition" required />
                                            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">URL Slug</label>
                                            <div className="flex items-center rounded-lg overflow-hidden border border-gray-700 bg-[#0f1117] focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition">
                                                <span className="px-3 py-2.5 text-gray-500 text-sm border-r border-gray-700 shrink-0 select-none">/verhalen/</span>
                                                <input type="text" value={data.slug} onChange={(e) => setData('slug', e.target.value)} className="flex-1 bg-transparent px-3 py-2.5 text-gray-200 placeholder-gray-600 focus:outline-none text-sm" />
                                            </div>
                                            {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Samenvatting</label>
                                            <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none" placeholder="Korte samenvatting..." />
                                        </div>
                                    </div>
                                </div>

                                {/* Inhoud */}
                                <div className="bg-[#16181f] rounded-xl border border-gray-800 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-800">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Inhoud</h3>
                                    </div>
                                    <RichTextEditor value={data.content} onChange={(v) => setData('content', v)} placeholder="Schrijf je verhaal hier..." />
                                    {errors.content && <p className="text-red-400 text-xs px-6 pb-3">{errors.content}</p>}
                                </div>

                                {/* YouTube */}
                                <div className="bg-[#16181f] rounded-xl p-6 border border-gray-800">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">YouTube Video</h3>
                                    <input type="url" value={data.youtube_url} onChange={(e) => setData('youtube_url', e.target.value)} className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition" placeholder="https://www.youtube.com/watch?v=..." />
                                    {embedUrl && <div className="mt-4 aspect-video rounded-lg overflow-hidden"><iframe src={embedUrl} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="YouTube preview" /></div>}
                                </div>

                            </div>

                            {/* Right — sidebar */}
                            <div className="space-y-6">
                                {/* Publiceren */}
                                <div className="bg-[#16181f] rounded-xl p-6 border border-gray-800">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Publiceren</h3>
                                    <div className="space-y-2">
                                        {(['draft', 'published'] as const).map((s) => (
                                            <label key={s} className={`flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2.5 transition ${data.status === s ? 'bg-gray-800' : 'hover:bg-gray-800/50'}`}>
                                                <input type="radio" name="status" value={s} checked={data.status === s} onChange={() => setData('status', s)} className="text-emerald-500 focus:ring-emerald-500" />
                                                <div>
                                                    <span className="text-gray-200 text-sm font-medium block">{s === 'draft' ? 'Concept' : 'Gepubliceerd'}</span>
                                                    <span className="text-gray-500 text-xs">{s === 'draft' ? 'Niet zichtbaar op de site' : 'Zichtbaar op de site'}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {story.published_at && <p className="text-gray-600 text-xs mt-3 px-3">Gepubliceerd op: {new Date(story.published_at).toLocaleDateString('nl-NL')}</p>}
                                    <button type="submit" disabled={processing} className="mt-5 w-full px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold rounded-lg transition text-sm">
                                        {processing ? 'Opslaan...' : '💾 Wijzigingen opslaan'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.post(shareInstagram.url(story.id))}
                                        disabled={!story.featured_image}
                                        title={!story.featured_image ? 'Voeg eerst een uitgelichte afbeelding toe' : 'Deel op Instagram'}
                                        className="mt-2 w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition text-sm"
                                    >
                                        📸 Deel op Instagram
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.post(shareFacebook.url(story.id))}
                                        disabled={story.status !== 'published'}
                                        title={story.status !== 'published' ? 'Publiceer het verhaal eerst op de website' : 'Deel link op Facebook'}
                                        className="mt-2 w-full px-4 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition text-sm"
                                    >
                                        👍 Deel op Facebook
                                    </button>
                                </div>

                                {/* Featured image */}
                                <div className="bg-[#16181f] rounded-xl p-6 border border-gray-800">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Uitgelichte afbeelding</h3>
                                    <ImageUpload value={data.featured_image} onChange={(url) => setData('featured_image', url ?? '')} />
                                    {errors.featured_image && <p className="text-red-400 text-xs mt-2">{errors.featured_image}</p>}
                                </div>

                                {/* Gallery */}
                                <div className="bg-[#16181f] rounded-xl p-6 border border-gray-800">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Fotogalerij</h3>
                                    <p className="text-xs text-gray-500 mb-4">Meerdere foto&apos;s worden als slider getoond.</p>
                                    <GalleryPicker value={data.gallery_images as string[]} onChange={(urls) => setData('gallery_images', urls)} mediaImages={mediaImages} />
                                </div>

                                {/* Video */}
                                <div className="bg-[#16181f] rounded-xl p-6 border border-gray-800">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Video</h3>
                                    <p className="text-xs text-gray-500 mb-4">Kies een video uit de mediabibliotheek.</p>
                                    <VideoPicker value={data.library_video_url || null} onChange={(url) => setData('library_video_url', url ?? '')} mediaVideos={mediaVideos} />
                                </div>

                                {/* Locaties */}
                                <div className="bg-[#16181f] rounded-xl p-6 border border-gray-800">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Locaties</h3>
                                    {allVenues.length === 0 ? (
                                        <p className="text-xs text-gray-600">Nog geen locaties aangemaakt.</p>
                                    ) : (
                                        <div className="space-y-1 max-h-48 overflow-y-auto">
                                            {allVenues.map((venue) => (
                                                <label key={venue.id} className="flex items-center gap-2.5 cursor-pointer rounded-lg px-2 py-2 hover:bg-gray-800/50 transition">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.venue_ids.includes(venue.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setData('venue_ids', [...data.venue_ids, venue.id]);
                                                            } else {
                                                                setData('venue_ids', data.venue_ids.filter((id) => id !== venue.id));
                                                            }
                                                        }}
                                                        className="text-emerald-500 focus:ring-emerald-500 rounded"
                                                    />
                                                    <div className="min-w-0">
                                                        <span className="text-gray-200 text-sm block truncate">{venue.name}</span>
                                                        {venue.city && <span className="text-gray-500 text-xs">{venue.city}</span>}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Danger zone */}
                                <div className="bg-[#16181f] rounded-xl p-6 border border-red-900/30">
                                    <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-4">Gevaarzone</h3>
                                    <button type="button" onClick={handleDelete} className="w-full px-4 py-2.5 bg-transparent hover:bg-red-500/10 text-red-400 font-medium rounded-lg transition text-sm border border-red-500/20 hover:border-red-500/40">
                                        Verhaal verwijderen
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
