import AdminLayout from '@/Layouts/AdminLayout';
import GalleryPicker from '@/Components/GalleryPicker';
import ImageUpload from '@/Components/ImageUpload';
import RichTextEditor from '@/Components/RichTextEditor';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface MediaImage {
    id: number;
    url: string;
    filename: string;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    featured_image: string | null;
    gallery_images: string[] | null;
    youtube_url: string | null;
    status: 'draft' | 'published';
    published_at: string | null;
}

interface Props {
    post: Post;
    mediaImages: MediaImage[];
}

interface FormData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string;
    gallery_images: string[];
    youtube_url: string;
    status: 'draft' | 'published';
    [key: string]: string | string[];
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

export default function BlogEdit({ post, mediaImages }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? '',
        content: post.content ?? '',
        featured_image: post.featured_image ?? '',
        gallery_images: post.gallery_images ?? [],
        youtube_url: post.youtube_url ?? '',
        status: post.status,
    });

    const [slugManuallyEdited, setSlugManuallyEdited] = useState(true);

    const handleTitleChange = (title: string) => {
        setData('title', title);
        if (!slugManuallyEdited) {
            const slug = title
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setData('slug', slug);
        }
    };

    const handleSlugChange = (value: string) => {
        setSlugManuallyEdited(true);
        setData('slug', value);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/admin/blog/${post.id}`);
    };

    const handleDelete = () => {
        if (confirm(`Weet je zeker dat je "${post.title}" wilt verwijderen?`)) {
            router.delete(`/admin/blog/${post.id}`);
        }
    };

    const embedUrl = data.youtube_url ? getYoutubeEmbedUrl(data.youtube_url) : null;

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-lg font-semibold text-white">Blogpost bewerken</h2>
                    <div className="flex items-center gap-2">
                        {post.status === 'published' && (
                            <a
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 p-2 sm:px-4 sm:py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition text-sm"
                                title="Bekijken"
                            >
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <span className="hidden sm:inline">Bekijken</span>
                            </a>
                        )}
                        <Link
                            href="/admin/blog"
                            className="flex items-center gap-1.5 p-2 sm:px-4 sm:py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition text-sm"
                            title="Terug"
                        >
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="hidden sm:inline">Terug</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Bewerken: ${post.title}`} />

            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Left column — main content */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Title & Slug */}
                                <div className="bg-[#16181f] rounded-xl p-6 border border-gray-800">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">Algemeen</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Titel *</label>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => handleTitleChange(e.target.value)}
                                                className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                                placeholder="Titel van je blogpost..."
                                                required
                                            />
                                            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">URL Slug</label>
                                            <div className="flex items-center rounded-lg overflow-hidden border border-gray-700 bg-[#0f1117] focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition">
                                                <span className="px-3 py-2.5 text-gray-500 text-sm border-r border-gray-700 shrink-0 select-none">/blog/</span>
                                                <input
                                                    type="text"
                                                    value={data.slug}
                                                    onChange={(e) => handleSlugChange(e.target.value)}
                                                    className="flex-1 bg-transparent px-3 py-2.5 text-gray-200 placeholder-gray-600 focus:outline-none text-sm"
                                                    placeholder="url-van-je-post"
                                                />
                                            </div>
                                            {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Samenvatting</label>
                                            <textarea
                                                value={data.excerpt}
                                                onChange={(e) => setData('excerpt', e.target.value)}
                                                rows={3}
                                                className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none"
                                                placeholder="Korte samenvatting die in de lijst wordt getoond..."
                                            />
                                            {errors.excerpt && <p className="text-red-400 text-xs mt-1">{errors.excerpt}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="bg-[#16181f] rounded-xl border border-gray-800 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-800">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Inhoud</h3>
                                    </div>
                                    <RichTextEditor
                                        value={data.content}
                                        onChange={(value) => setData('content', value)}
                                        placeholder="Schrijf je blogpost hier..."
                                    />
                                    {errors.content && <p className="text-red-400 text-xs px-6 pb-3">{errors.content}</p>}
                                </div>

                                {/* YouTube */}
                                <div className="bg-[#16181f] rounded-xl p-6 border border-gray-800">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">YouTube Video</h3>
                                    <input
                                        type="url"
                                        value={data.youtube_url}
                                        onChange={(e) => setData('youtube_url', e.target.value)}
                                        className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                    {errors.youtube_url && <p className="text-red-400 text-xs mt-1">{errors.youtube_url}</p>}
                                    {embedUrl && (
                                        <div className="mt-4 aspect-video rounded-lg overflow-hidden">
                                            <iframe
                                                src={embedUrl}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                title="YouTube preview"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right column — sidebar */}
                            <div className="space-y-6">

                                {/* Publish */}
                                <div className="bg-[#16181f] rounded-xl p-6 border border-gray-800">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Publiceren</h3>
                                    <div className="space-y-2">
                                        <label className={`flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2.5 transition ${
                                            data.status === 'draft' ? 'bg-gray-800' : 'hover:bg-gray-800/50'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="status"
                                                value="draft"
                                                checked={data.status === 'draft'}
                                                onChange={() => setData('status', 'draft')}
                                                className="text-emerald-500 focus:ring-emerald-500"
                                            />
                                            <div>
                                                <span className="text-gray-200 text-sm font-medium block">Concept</span>
                                                <span className="text-gray-500 text-xs">Niet zichtbaar op de site</span>
                                            </div>
                                        </label>
                                        <label className={`flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2.5 transition ${
                                            data.status === 'published' ? 'bg-gray-800' : 'hover:bg-gray-800/50'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="status"
                                                value="published"
                                                checked={data.status === 'published'}
                                                onChange={() => setData('status', 'published')}
                                                className="text-emerald-500 focus:ring-emerald-500"
                                            />
                                            <div>
                                                <span className="text-gray-200 text-sm font-medium block">Gepubliceerd</span>
                                                <span className="text-gray-500 text-xs">Zichtbaar op de site</span>
                                            </div>
                                        </label>
                                    </div>
                                    {post.published_at && (
                                        <p className="text-gray-600 text-xs mt-3 px-3">
                                            Gepubliceerd op: {new Date(post.published_at).toLocaleDateString('nl-NL')}
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="mt-5 w-full px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold rounded-lg transition text-sm"
                                    >
                                        {processing ? 'Opslaan...' : '💾 Wijzigingen opslaan'}
                                    </button>
                                </div>

                                {/* Featured image */}
                                <div className="bg-[#16181f] rounded-xl p-6 border border-gray-800">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Uitgelichte afbeelding</h3>
                                    <ImageUpload
                                        value={data.featured_image}
                                        onChange={(url) => setData('featured_image', url)}
                                    />
                                    {errors.featured_image && <p className="text-red-400 text-xs mt-2">{errors.featured_image}</p>}
                                </div>

                                {/* Gallery */}
                                <div className="bg-[#16181f] rounded-xl p-6 border border-gray-800">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Fotogalerij</h3>
                                    <p className="text-xs text-gray-500 mb-4">Meerdere foto's worden als slider getoond op de blogpost.</p>
                                    <GalleryPicker
                                        value={data.gallery_images as string[]}
                                        onChange={(urls) => setData('gallery_images', urls)}
                                        mediaImages={mediaImages}
                                    />
                                </div>

                                {/* Danger zone */}
                                <div className="bg-[#16181f] rounded-xl p-6 border border-red-900/30">
                                    <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-4">Gevaarzone</h3>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="w-full px-4 py-2.5 bg-transparent hover:bg-red-500/10 text-red-400 font-medium rounded-lg transition text-sm border border-red-500/20 hover:border-red-500/40"
                                    >
                                        Blogpost verwijderen
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
