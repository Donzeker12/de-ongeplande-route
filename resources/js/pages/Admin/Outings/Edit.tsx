import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import RichTextEditor from '@/Components/RichTextEditor';
import ImageUpload from '@/Components/ImageUpload';
import type { Category, Discovery, Outing, Venue } from '@/types';

interface OutingEditProps {
    outing: Outing;
    categories: Category[];
    venues: Venue[];
}

interface PricePass {
    name: string;
    discount: string;
}

interface PriceDetails {
    adult: string;
    child: string;
    senior: string;
    baby: string;
    passes: PricePass[];
    notes: string;
    // discount_codes hidden for now, will be added later
}

interface OutingFormData {
    title: string;
    slug: string;
    story: string;
    location: string;
    city: string;
    price_info: string;
    price_details: PriceDetails;
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

export default function OutingEdit({ outing, categories, venues }: OutingEditProps) {
    const { data, setData, patch, processing, errors } = useForm<OutingFormData>({
        title: outing.title || '',
        slug: outing.slug || '',
        story: outing.story || '',
        location: outing.location || '',
        city: outing.city || '',
        price_info: outing.price_info || '',
        price_details: {
            adult: (outing.price_details as PriceDetails | undefined)?.adult ?? '',
            child: (outing.price_details as PriceDetails | undefined)?.child ?? '',
            senior: (outing.price_details as PriceDetails | undefined)?.senior ?? '',
            baby: (outing.price_details as PriceDetails | undefined)?.baby ?? '',
            passes: (outing.price_details as PriceDetails | undefined)?.passes ?? [],
            notes: (outing.price_details as PriceDetails | undefined)?.notes ?? '',
        },
        mood: outing.mood || '',
        featured_image: outing.featured_image || '',
        images: outing.images && outing.images.length > 0 ? outing.images : [''],
        is_recommended: outing.is_recommended || false,
        is_free: outing.is_free || false,
        category: outing.category || '',
        category_id: outing.category_id ?? '',
        venue_id: outing.venue_id ?? '',
        visit_date: outing.visit_date || '',
        published_at: outing.published_at || '',
        share_facebook: false,
        share_instagram: false,
    });

    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [discoveries, setDiscoveries] = useState<Discovery[]>(outing.discoveries ?? []);
    const [editingDiscovery, setEditingDiscovery] = useState<number | null>(null);
    const [showAddDiscovery, setShowAddDiscovery] = useState(false);
    const [newDiscovery, setNewDiscovery] = useState({ title: '', type: 'plek' as Discovery['type'], description: '' });
    const [editDiscoveryData, setEditDiscoveryData] = useState<{ title: string; type: Discovery['type']; description: string } | null>(null);
    const [discoveryProcessing, setDiscoveryProcessing] = useState(false);

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
        patch(`/admin/outings/${outing.id}`, {
            onSuccess: () => {
                setData('share_facebook', false);
                setData('share_instagram', false);
            },
        });
    };

    const handleDeleteDiscovery = (id: number) => {
        if (!confirm('Weet je zeker dat je deze ontdekking wilt verwijderen?')) return;
        router.delete(`/admin/discoveries/${id}`, {
            preserveScroll: true,
            onSuccess: () => setDiscoveries((prev) => prev.filter((d) => d.id !== id)),
        });
    };

    const handleEditDiscovery = (discovery: Discovery) => {
        setEditingDiscovery(discovery.id);
        setEditDiscoveryData({ title: discovery.title, type: discovery.type, description: discovery.description });
    };

    const handleSaveDiscovery = (id: number) => {
        if (!editDiscoveryData) return;
        setDiscoveryProcessing(true);
        router.patch(`/admin/discoveries/${id}`, editDiscoveryData, {
            preserveScroll: true,
            onSuccess: () => {
                setDiscoveries((prev) => prev.map((d) => d.id === id ? { ...d, ...editDiscoveryData } : d));
                setEditingDiscovery(null);
                setEditDiscoveryData(null);
                setDiscoveryProcessing(false);
            },
            onError: () => setDiscoveryProcessing(false),
        });
    };

    const handleAddDiscovery = () => {
        setDiscoveryProcessing(true);
        router.post('/admin/discoveries', { ...newDiscovery, outing_id: outing.id }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowAddDiscovery(false);
                setNewDiscovery({ title: '', type: 'plek', description: '' });
                setDiscoveryProcessing(false);
                router.reload({ only: [] });
            },
            onError: () => setDiscoveryProcessing(false),
        });
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

    const updatePriceDetails = (field: keyof PriceDetails, value: string) => {
        setData('price_details', { ...data.price_details, [field]: value });
    };

    const addPass = () => {
        setData('price_details', {
            ...data.price_details,
            passes: [...data.price_details.passes, { name: '', discount: '' }],
        });
    };

    const updatePass = (index: number, field: keyof PricePass, value: string) => {
        const passes = [...data.price_details.passes];
        passes[index] = { ...passes[index], [field]: value };
        setData('price_details', { ...data.price_details, passes });
    };

    const removePass = (index: number) => {
        setData('price_details', {
            ...data.price_details,
            passes: data.price_details.passes.filter((_, i) => i !== index),
        });
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-lg font-semibold text-white">
                        {outing.title} Bewerken
                    </h2>
                    <div className="flex space-x-2">
                        <Link
                            href={`/uitjes/${outing.slug}`}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                        >
                            👁️ Bekijk
                        </Link>
                        <Link
                            href="/admin/outings"
                            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition text-sm"
                        >
                            ← Terug
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`${outing.title} - Bewerken`} />

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

                                {/* Ontdekkingen Section */}
                                <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">✨ Ontdekkingen ({discoveries.length})</h3>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddDiscovery((v) => !v)}
                                            className="px-3 py-1.5 text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition"
                                        >
                                            + Toevoegen
                                        </button>
                                    </div>

                                    {showAddDiscovery && (
                                        <div className="mb-4 p-4 bg-[#0f1117] border border-emerald-500/20 rounded-lg space-y-3">
                                            <p className="text-xs text-emerald-400 font-medium uppercase tracking-wider">Nieuwe ontdekking</p>
                                            <input
                                                type="text"
                                                value={newDiscovery.title}
                                                onChange={(e) => setNewDiscovery((p) => ({ ...p, title: e.target.value }))}
                                                placeholder="Titel"
                                                className="w-full px-3 py-2 bg-[#16181f] border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                                            />
                                            <div className="flex gap-2">
                                                {(['dier', 'plek', 'weetje'] as Discovery['type'][]).map((t) => (
                                                    <button
                                                        key={t}
                                                        type="button"
                                                        onClick={() => setNewDiscovery((p) => ({ ...p, type: t }))}
                                                        className={`flex-1 py-1.5 text-xs rounded border transition ${newDiscovery.type === t ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-[#16181f] border-gray-700 text-gray-500'}`}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea
                                                value={newDiscovery.description}
                                                onChange={(e) => setNewDiscovery((p) => ({ ...p, description: e.target.value }))}
                                                placeholder="Beschrijving"
                                                rows={2}
                                                className="w-full px-3 py-2 bg-[#16181f] border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition resize-none"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handleAddDiscovery}
                                                    disabled={discoveryProcessing || !newDiscovery.title}
                                                    className="px-4 py-1.5 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition disabled:opacity-50"
                                                >
                                                    Toevoegen
                                                </button>
                                                <button type="button" onClick={() => setShowAddDiscovery(false)} className="px-4 py-1.5 text-sm text-gray-400 hover:text-gray-200 transition">
                                                    Annuleren
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {discoveries.length === 0 ? (
                                        <p className="text-sm text-gray-600 italic">Nog geen ontdekkingen. Voeg er een toe.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {discoveries.map((discovery) => (
                                                <div key={discovery.id} className="p-4 bg-[#0f1117] border border-gray-800 rounded-lg">
                                                    {editingDiscovery === discovery.id && editDiscoveryData ? (
                                                        <div className="space-y-2">
                                                            <input
                                                                type="text"
                                                                value={editDiscoveryData.title}
                                                                onChange={(e) => setEditDiscoveryData((p) => p ? { ...p, title: e.target.value } : p)}
                                                                className="w-full px-3 py-1.5 bg-[#16181f] border border-gray-700 rounded text-sm text-gray-300 focus:outline-none focus:border-emerald-500"
                                                            />
                                                            <div className="flex gap-2">
                                                                {(['dier', 'plek', 'weetje'] as Discovery['type'][]).map((t) => (
                                                                    <button
                                                                        key={t}
                                                                        type="button"
                                                                        onClick={() => setEditDiscoveryData((p) => p ? { ...p, type: t } : p)}
                                                                        className={`flex-1 py-1 text-xs rounded border transition ${editDiscoveryData.type === t ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-[#16181f] border-gray-700 text-gray-500'}`}
                                                                    >
                                                                        {t}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            <textarea
                                                                value={editDiscoveryData.description}
                                                                onChange={(e) => setEditDiscoveryData((p) => p ? { ...p, description: e.target.value } : p)}
                                                                rows={2}
                                                                className="w-full px-3 py-1.5 bg-[#16181f] border border-gray-700 rounded text-sm text-gray-300 focus:outline-none focus:border-emerald-500 resize-none"
                                                            />
                                                            <div className="flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSaveDiscovery(discovery.id)}
                                                                    disabled={discoveryProcessing}
                                                                    className="px-3 py-1 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600 transition disabled:opacity-50"
                                                                >
                                                                    Opslaan
                                                                </button>
                                                                <button type="button" onClick={() => setEditingDiscovery(null)} className="px-3 py-1 text-xs text-gray-400 hover:text-gray-200 transition">
                                                                    Annuleren
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="font-medium text-gray-200 text-sm">{discovery.title}</h4>
                                                                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">{discovery.type}</span>
                                                                </div>
                                                                <p className="text-xs text-gray-500 line-clamp-2">{discovery.description}</p>
                                                            </div>
                                                            <div className="flex gap-1 shrink-0">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleEditDiscovery(discovery)}
                                                                    className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteDiscovery(discovery.id)}
                                                                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                                            {processing ? 'Bezig...' : 'Wijzigingen Opslaan'}
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
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Prijs (samenvatting)</label>
                                        <input
                                            type="text"
                                            value={data.price_info}
                                            onChange={(e) => setData('price_info', e.target.value)}
                                            placeholder="bijv. vanaf €9,50"
                                            className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                        />
                                        <p className="mt-1 text-xs text-gray-600">Korte samenvatting zichtbaar in kaarten</p>
                                    </div>

                                    {/* Uitgebreide prijzen */}
                                    <div className="border border-gray-700 rounded-lg p-4 space-y-3">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Prijzen per categorie</p>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Volwassene</label>
                                                <input
                                                    type="text"
                                                    value={data.price_details.adult}
                                                    onChange={(e) => updatePriceDetails('adult', e.target.value)}
                                                    placeholder="€14,50"
                                                    className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Kind</label>
                                                <input
                                                    type="text"
                                                    value={data.price_details.child}
                                                    onChange={(e) => updatePriceDetails('child', e.target.value)}
                                                    placeholder="€9,50"
                                                    className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Senior / 65+</label>
                                                <input
                                                    type="text"
                                                    value={data.price_details.senior}
                                                    onChange={(e) => updatePriceDetails('senior', e.target.value)}
                                                    placeholder="€11,00"
                                                    className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Baby / Peuter</label>
                                                <input
                                                    type="text"
                                                    value={data.price_details.baby}
                                                    onChange={(e) => updatePriceDetails('baby', e.target.value)}
                                                    placeholder="Gratis (t/m 2 jaar)"
                                                    className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                                />
                                            </div>
                                        </div>

                                        {/* Passen / kortingen */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Passen & kortingen</p>
                                                <button
                                                    type="button"
                                                    onClick={addPass}
                                                    className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded hover:bg-emerald-500/20 transition"
                                                >
                                                    + Toevoegen
                                                </button>
                                            </div>
                                            {data.price_details.passes.length === 0 && (
                                                <p className="text-xs text-gray-600 italic">Bijv. Museumkaart, CJP, etc.</p>
                                            )}
                                            {data.price_details.passes.map((pass, i) => (
                                                <div key={i} className="flex gap-2 mb-2">
                                                    <input
                                                        type="text"
                                                        value={pass.name}
                                                        onChange={(e) => updatePass(i, 'name', e.target.value)}
                                                        placeholder="Museumkaart"
                                                        className="flex-1 bg-[#0f1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 transition"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={pass.discount}
                                                        onChange={(e) => updatePass(i, 'discount', e.target.value)}
                                                        placeholder="Gratis / €3 korting"
                                                        className="flex-1 bg-[#0f1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 transition"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removePass(i)}
                                                        className="px-2 text-red-400 hover:text-red-300 transition"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Notitie */}
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Opmerking</label>
                                            <input
                                                type="text"
                                                value={data.price_details.notes}
                                                onChange={(e) => updatePriceDetails('notes', e.target.value)}
                                                placeholder="Prijzen incl. BTW, online goedkoper, etc."
                                                className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                                            />
                                        </div>
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
