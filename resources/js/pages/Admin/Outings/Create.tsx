import AdminLayout from '@/Layouts/AdminLayout';
import type { Category, Venue } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import RichTextEditor from '@/Components/RichTextEditor';
import ImageUpload from '@/Components/ImageUpload';

interface OutingCreateProps {
    categories: Category[];
    venues: Venue[];
}

interface OutingFormData {
    title: string;
    slug: string;
    story: string;
    location: string;
    city: string;
    price_info: string;
    mood: string;
    featured_image: string;
    images: string[];
    is_recommended: boolean;
    is_free: boolean;
    category: string;
    category_id: number | string;
    venue_id: number | string;
    visit_date: string;
    published_at: string;
    share_facebook: boolean;
    share_instagram: boolean;
}

export default function OutingCreate({ categories, venues }: OutingCreateProps) {
    const { data, setData, post, processing, errors } = useForm<OutingFormData>({
        title: '',
        slug: '',
        story: '',
        location: '',
        city: '',
        price_info: '',
        mood: '',
        featured_image: '',
        images: [''],
        is_recommended: false,
        is_free: false,
        category: '',
        category_id: '',
        venue_id: '',
        visit_date: '',
        published_at: '',
        share_facebook: false,
        share_instagram: false,
    });

    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

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

    const handleSlugChange = (slug: string) => {
        setSlugManuallyEdited(true);
        setData('slug', slug);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/outings');
    };

    const addImageField = () => {
        setData('images', [...data.images, '']);
    };

    const removeImageField = (index: number) => {
        const newImages = data.images.filter((_, i) => i !== index);
        setData('images', newImages.length > 0 ? newImages : ['']);
    };

    const updateImageField = (index: number, value: string) => {
        const newImages = [...data.images];
        newImages[index] = value;
        setData('images', newImages);
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-lg font-semibold text-white">
                        Nieuw Verhaal Aanmaken
                    </h2>
                    <Link
                        href="/admin/outings"
                        className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition text-sm"
                    >
                        ← Terug
                    </Link>
                </div>
            }
        >
            <Head title="Nieuw Verhaal" />

            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Left column — main content */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Inhoud</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Titel *</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => handleTitleChange(e.target.value)}
                                            className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                            required
                                        />
                                        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) => handleSlugChange(e.target.value)}
                                            className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                        />
                                        {errors.slug && <p className="mt-1 text-sm text-red-400">{errors.slug}</p>}
                                        <p className="mt-1 text-xs text-gray-600">Laat leeg om automatisch te genereren</p>
                                    </div>
                                </div>

                                <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">📖 Het Verhaal</h3>
                                    <RichTextEditor
                                        value={data.story}
                                        onChange={(value) => setData('story', value)}
                                        placeholder="Schrijf hier jullie verhaal..."
                                    />
                                    {errors.story && <p className="mt-2 text-sm text-red-400">{errors.story}</p>}
                                </div>

                                <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">📷 Foto's</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Hoofdfoto</label>
                                        <ImageUpload
                                            value={data.featured_image}
                                            onChange={(url) => setData('featured_image', url)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Extra Foto's (URLs)</label>
                                        {data.images.map((image, index) => (
                                            <div key={index} className="flex gap-2 mb-2">
                                                <input
                                                    type="url"
                                                    value={image}
                                                    onChange={(e) => updateImageField(index, e.target.value)}
                                                    className="flex-1 bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                                    placeholder="https://images.unsplash.com/..."
                                                />
                                                {data.images.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImageField(index)}
                                                        className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addImageField}
                                            className="mt-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition text-sm"
                                        >
                                            + Foto Toevoegen
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right column — metadata */}
                            <div className="space-y-6">
                                <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Publiceren</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Publicatiedatum</label>
                                        <input
                                            type="datetime-local"
                                            value={data.published_at}
                                            onChange={(e) => setData('published_at', e.target.value)}
                                            className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition [color-scheme:dark]"
                                        />
                                        <p className="mt-1 text-xs text-gray-600">Leeg = concept</p>
                                    </div>

                                    <div className="space-y-3 pt-1">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.is_free}
                                                onChange={(e) => setData('is_free', e.target.checked)}
                                                className="rounded border-gray-600 bg-[#0f1117] text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                                            />
                                            <span className="text-sm text-gray-300">Gratis toegang</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.is_recommended}
                                                onChange={(e) => setData('is_recommended', e.target.checked)}
                                                className="rounded border-gray-600 bg-[#0f1117] text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                                            />
                                            <span className="text-sm text-gray-300">⭐ Aanbevolen</span>
                                        </label>
                                    </div>

                                    <div className="pt-2 border-t border-gray-800">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Delen op socials</p>
                                        <div className="space-y-2.5">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={data.share_facebook}
                                                    onChange={(e) => setData('share_facebook', e.target.checked)}
                                                    className="rounded border-gray-600 bg-[#0f1117] text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                                                />
                                                <span className="flex items-center gap-2 text-sm text-gray-300">
                                                    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                    </svg>
                                                    Facebook
                                                </span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={data.share_instagram}
                                                    onChange={(e) => setData('share_instagram', e.target.checked)}
                                                    className="rounded border-gray-600 bg-[#0f1117] text-pink-500 focus:ring-pink-500 focus:ring-offset-0"
                                                />
                                                <span className="flex items-center gap-2 text-sm text-gray-300">
                                                    <svg className="w-4 h-4 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                                    </svg>
                                                    Instagram
                                                </span>
                                            </label>
                                        </div>
                                        {(data.share_instagram && !data.featured_image) && (
                                            <p className="mt-2 text-xs text-amber-400">⚠️ Instagram vereist een hoofdfoto</p>
                                        )}
                                    </div>

                                    <div className="pt-2 flex flex-col gap-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full px-4 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition disabled:opacity-50 font-medium shadow-lg hover:shadow-emerald-500/20"
                                        >
                                            {processing ? 'Bezig...' : 'Verhaal Opslaan'}
                                        </button>
                                        <Link
                                            href="/admin/outings"
                                            className="w-full text-center px-4 py-2.5 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition text-sm"
                                        >
                                            Annuleren
                                        </Link>
                                    </div>
                                </div>

                                <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Details</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Categorie</label>
                                        <select
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                        >
                                            <option value="">Selecteer categorie...</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Locatie / Plek</label>
                                        <select
                                            value={data.venue_id}
                                            onChange={(e) => setData('venue_id', e.target.value)}
                                            className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                        >
                                            <option value="">Geen specifieke locatie</option>
                                            {venues.map((venue) => (
                                                <option key={venue.id} value={venue.id}>{venue.name}{venue.city ? ` — ${venue.city}` : ''}</option>
                                            ))}
                                        </select>
                                        <p className="mt-1 text-xs text-gray-600">Staat de locatie er niet bij? <Link href="/admin/venues/create" className="text-emerald-500 hover:text-emerald-400">Voeg hem toe →</Link></p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Stad</label>
                                        <input
                                            type="text"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Locatie (Adres)</label>
                                        <input
                                            type="text"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Prijs Info</label>
                                        <input
                                            type="text"
                                            value={data.price_info}
                                            onChange={(e) => setData('price_info', e.target.value)}
                                            placeholder="vanaf €29,50"
                                            className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Sfeer</label>
                                        <input
                                            type="text"
                                            value={data.mood}
                                            onChange={(e) => setData('mood', e.target.value)}
                                            placeholder="gezellig, rustig..."
                                            className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Bezoek Datum</label>
                                        <input
                                            type="date"
                                            value={data.visit_date}
                                            onChange={(e) => setData('visit_date', e.target.value)}
                                            className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
