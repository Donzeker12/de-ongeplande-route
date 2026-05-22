import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

interface Settings {
    hero_background_url: string | null;
    hero_title: string;
    hero_subtitle: string;
    hero_description: string;
}

interface SettingsPageProps {
    settings: Settings;
}

export default function SettingsIndex({ settings }: SettingsPageProps) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const [previewUrl, setPreviewUrl] = useState<string | null>(settings.hero_background_url);
    const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        hero_background_url: string;
        hero_background_image: File | null;
        hero_title: string;
        hero_subtitle: string;
        hero_description: string;
        _method: string;
    }>({
        hero_background_url: settings.hero_background_url ?? '',
        hero_background_image: null,
        hero_title: settings.hero_title ?? '',
        hero_subtitle: settings.hero_subtitle ?? '',
        hero_description: settings.hero_description ?? '',
        _method: 'PUT',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('hero_background_image', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUrlChange = (url: string) => {
        setData('hero_background_url', url);
        setPreviewUrl(url || null);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/settings', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout header={<h2 className="text-lg font-semibold text-white">Site Instellingen</h2>}>
            <Head title="Site Instellingen" />

            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-3xl space-y-6">

                    {flash?.success && (
                        <div className="bg-emerald-900/40 border border-emerald-700 text-emerald-300 px-4 py-3 rounded-xl text-sm">
                            {flash.success}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">

                        {/* Hero Achtergrond */}
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-6 bg-gradient-to-b from-violet-400 to-indigo-500 rounded-full" />
                                <h3 className="text-base font-semibold text-white">Hero Achtergrond</h3>
                            </div>

                            {/* Mode toggle */}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setImageMode('url')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                                        imageMode === 'url'
                                            ? 'bg-violet-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    URL
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageMode('upload')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                                        imageMode === 'upload'
                                            ? 'bg-violet-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:text-white'
                                    }`}
                                >
                                    Afbeelding uploaden
                                </button>
                            </div>

                            {imageMode === 'url' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Afbeelding URL</label>
                                    <input
                                        type="url"
                                        value={data.hero_background_url}
                                        onChange={(e) => handleUrlChange(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500 transition"
                                    />
                                    {errors.hero_background_url && (
                                        <p className="mt-1 text-xs text-red-400">{errors.hero_background_url}</p>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Upload afbeelding <span className="text-gray-500 font-normal">(max 5 MB)</span>
                                    </label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="cursor-pointer border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-violet-600 transition"
                                    >
                                        <p className="text-sm text-gray-400">Klik om een afbeelding te kiezen</p>
                                        {data.hero_background_image && (
                                            <p className="text-xs text-violet-400 mt-1">{data.hero_background_image.name}</p>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    {errors.hero_background_image && (
                                        <p className="mt-1 text-xs text-red-400">{errors.hero_background_image}</p>
                                    )}
                                </div>
                            )}

                            {/* Preview */}
                            {previewUrl && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Voorbeeld</p>
                                    <div
                                        className="relative h-40 rounded-xl overflow-hidden bg-cover bg-center border border-gray-700"
                                        style={{ backgroundImage: `url(${previewUrl})` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
                                        <div className="absolute inset-0 flex items-center justify-center text-white text-center px-4">
                                            <div>
                                                <p className="font-serif text-xl font-medium">{data.hero_title || 'Titel'}</p>
                                                <p className="text-xs tracking-widest mt-1 opacity-80">{data.hero_subtitle || 'Ondertitel'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Hero Teksten */}
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full" />
                                <h3 className="text-base font-semibold text-white">Hero Teksten</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Hoofdtitel</label>
                                <input
                                    type="text"
                                    value={data.hero_title}
                                    onChange={(e) => setData('hero_title', e.target.value)}
                                    className="w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-emerald-500 transition"
                                />
                                {errors.hero_title && <p className="mt-1 text-xs text-red-400">{errors.hero_title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Ondertitel <span className="text-gray-500 font-normal">(kleine tekst in hoofdletters)</span></label>
                                <input
                                    type="text"
                                    value={data.hero_subtitle}
                                    onChange={(e) => setData('hero_subtitle', e.target.value)}
                                    className="w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-emerald-500 transition"
                                />
                                {errors.hero_subtitle && <p className="mt-1 text-xs text-red-400">{errors.hero_subtitle}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Beschrijving</label>
                                <input
                                    type="text"
                                    value={data.hero_description}
                                    onChange={(e) => setData('hero_description', e.target.value)}
                                    className="w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-emerald-500 transition"
                                />
                                {errors.hero_description && <p className="mt-1 text-xs text-red-400">{errors.hero_description}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition"
                            >
                                {processing ? 'Opslaan...' : 'Instellingen opslaan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
