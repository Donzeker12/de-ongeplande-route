import AdminLayout from '@/Layouts/AdminLayout';
import GalleryPicker from '@/Components/GalleryPicker';
import VideoPicker from '@/Components/VideoPicker';
import ImageUpload from '@/Components/ImageUpload';
import RichTextEditor from '@/Components/RichTextEditor';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface MediaImage { id: number; url: string; filename: string; }
interface MediaVideo { id: number; url: string; filename: string; }

interface Chapter { title: string; content: string; }

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
    [key: string]: unknown;
}

interface Props {
    mediaImages: MediaImage[];
    mediaVideos: MediaVideo[];
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

export default function StoryCreate({ mediaImages, mediaVideos }: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: '',
        slug: '',
        description: '',
        content: '',
        featured_image: '',
        gallery_images: [],
        youtube_url: '',
        library_video_url: '',
        status: 'draft',
        ai_settings: { tone: 'vriendelijk', length: 'medium', style: 'verhaal' },
        chapters: [],
    });

    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [showAI, setShowAI] = useState(false);

    const handleTitleChange = (title: string) => {
        setData('title', title);
        if (!slugManuallyEdited) {
            const slug = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setData('slug', slug);
        }
    };

    const addChapter = () => setData('chapters', [...data.chapters, { title: '', content: '' }]);
    const removeChapter = (i: number) => setData('chapters', data.chapters.filter((_, idx) => idx !== i));
    const updateChapter = (i: number, field: keyof Chapter, value: string) => {
        const updated = [...data.chapters];
        updated[i] = { ...updated[i], [field]: value };
        setData('chapters', updated);
    };

    const handleSubmit = (e: FormEvent) => { e.preventDefault(); post(route('admin.stories.store')); };
    const embedUrl = data.youtube_url ? getYoutubeEmbedUrl(data.youtube_url) : null;

    return (
        <AdminLayout header={
            <div className="flex items-center justify-between w-full">
                <h2 className="text-lg font-semibold text-white">Nieuw Verhaal</h2>
                <Link href="/admin/stories" className="flex items-center gap-1.5 p-2 sm:px-4 sm:py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition text-sm">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    <span className="hidden sm:inline">Terug</span>
                </Link>
            </div>
        }>
            <Head title="Nieuw Verhaal" />

            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Left — main content */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Algemeen */}
                                <div className="bg-[#16181f] rounded-xl p-6 border border-gray-800">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">Algemeen</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Titel *</label>
                                            <input type="text" value={data.title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition" placeholder="Titel van het verhaal..." required />
                                            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">URL Slug</label>
                                            <div className="flex items-center rounded-lg overflow-hidden border border-gray-700 bg-[#0f1117] focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition">
                                                <span className="px-3 py-2.5 text-gray-500 text-sm border-r border-gray-700 shrink-0 select-none">/verhalen/</span>
                                                <input type="text" value={data.slug} onChange={(e) => { setSlugManuallyEdited(true); setData('slug', e.target.value); }} className="flex-1 bg-transparent px-3 py-2.5 text-gray-200 placeholder-gray-600 focus:outline-none text-sm" placeholder="url-van-je-verhaal" />
                                            </div>
                                            {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Samenvatting</label>
                                            <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none" placeholder="Korte samenvatting..." />
                                            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
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

                                {/* AI Sectie */}
                                <div className="bg-[#16181f] rounded-xl border border-gray-800 overflow-hidden">
                                    <button type="button" onClick={() => setShowAI(!showAI)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition">
                                        <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">🤖 AI Verhaal Genereren (optioneel)</h3>
                                        <svg className={`w-4 h-4 text-gray-500 transition-transform ${showAI ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    {showAI && (
                                        <div className="px-6 pb-6 space-y-5 border-t border-gray-800">
                                            <p className="text-xs text-gray-500 pt-4">Voeg hoofdstukken toe en laat AI een verhaal schrijven op basis van jouw notities.</p>
                                            {/* AI Settings */}
                                            <div className="grid grid-cols-3 gap-3">
                                                {[['tone', 'Toon', [['vriendelijk','Vriendelijk'],['avontuurlijk','Avontuurlijk'],['grappig','Grappig'],['nostalgisch','Nostalgisch'],['informatief','Informatief']]], ['length', 'Lengte', [['kort','Kort'],['medium','Medium'],['lang','Lang']]], ['style', 'Stijl', [['verhaal','Verhaal'],['dagboek','Dagboek'],['blog','Blog Post'],['gids','Reisgids']]]].map(([key, label, options]) => (
                                                    <div key={key as string}>
                                                        <label className="block text-xs font-medium text-gray-400 mb-1.5">{label as string}</label>
                                                        <select value={(data.ai_settings as Record<string, string>)[key as string]} onChange={(e) => setData('ai_settings', { ...data.ai_settings, [key as string]: e.target.value })} className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition">
                                                            {(options as string[][]).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                                        </select>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Chapters */}
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <label className="text-sm font-medium text-gray-300">Hoofdstukken</label>
                                                    <button type="button" onClick={addChapter} className="text-xs px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition border border-purple-600/30">+ Hoofdstuk</button>
                                                </div>
                                                <div className="space-y-3">
                                                    {data.chapters.map((ch, i) => (
                                                        <div key={i} className="bg-[#0f1117] rounded-lg p-4 border border-gray-800">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <span className="text-xs text-gray-500 font-medium">Hoofdstuk {i + 1}</span>
                                                                <button type="button" onClick={() => removeChapter(i)} className="text-red-500 hover:text-red-400 text-xs">Verwijderen</button>
                                                            </div>
                                                            <input type="text" value={ch.title} onChange={(e) => updateChapter(i, 'title', e.target.value)} placeholder="Titel..." className="w-full bg-[#16181f] border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm mb-2 focus:border-purple-500 focus:outline-none" required />
                                                            <textarea value={ch.content} onChange={(e) => updateChapter(i, 'content', e.target.value)} placeholder="Notities..." rows={2} className="w-full bg-[#16181f] border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm resize-none focus:border-purple-500 focus:outline-none" />
                                                        </div>
                                                    ))}
                                                    {data.chapters.length === 0 && <p className="text-xs text-gray-600 text-center py-4">Nog geen hoofdstukken. Klik op &apos;+ Hoofdstuk&apos; om te beginnen.</p>}
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
                                    <button type="submit" disabled={processing} className="mt-5 w-full px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold rounded-lg transition text-sm">
                                        {processing ? 'Aanmaken...' : '✨ Verhaal aanmaken'}
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
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
