import AdminLayout from '@/Layouts/AdminLayout';
import ImageUpload from '@/Components/ImageUpload';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { exchangeInstagramToken } from '@/actions/App/Http/Controllers/Admin/SiteSettingController';

interface Settings {
    hero_background_url: string | null;
    hero_title: string;
    hero_subtitle: string;
    hero_description: string;
    instagram_business_account_id: string | null;
    instagram_page_access_token: string | null;
    instagram_token_obtained_at: string | null;
    instagram_hashtags: string;
    over_ons_hero_title: string;
    over_ons_hero_intro: string;
    over_ons_hero_image: string;
    over_ons_hero_year: string;
    over_ons_mission_title: string;
    over_ons_mission_text: string;
    over_ons_pillar_1_title: string;
    over_ons_pillar_1_text: string;
    over_ons_pillar_2_title: string;
    over_ons_pillar_2_text: string;
    over_ons_pillar_3_title: string;
    over_ons_pillar_3_text: string;
    over_ons_story_title: string;
    over_ons_story_image: string;
    over_ons_story_text: string;
    over_ons_cta_title: string;
    over_ons_cta_text: string;
}

interface SettingsPageProps {
    settings: Settings;
}

type Tab = 'homepage' | 'over-ons' | 'instagram';

export default function SettingsIndex({ settings }: SettingsPageProps) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [activeTab, setActiveTab] = useState<Tab>('homepage');
    const [previewUrl, setPreviewUrl] = useState<string | null>(settings.hero_background_url);
    const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm<{
        hero_background_url: string;
        hero_background_image: File | null;
        hero_title: string;
        hero_subtitle: string;
        hero_description: string;
        instagram_business_account_id: string;
        instagram_page_access_token: string;
        instagram_hashtags: string;
        over_ons_hero_title: string;
        over_ons_hero_intro: string;
        over_ons_hero_image: string;
        over_ons_hero_year: string;
        over_ons_mission_title: string;
        over_ons_mission_text: string;
        over_ons_pillar_1_title: string;
        over_ons_pillar_1_text: string;
        over_ons_pillar_2_title: string;
        over_ons_pillar_2_text: string;
        over_ons_pillar_3_title: string;
        over_ons_pillar_3_text: string;
        over_ons_story_title: string;
        over_ons_story_image: string;
        over_ons_story_text: string;
        over_ons_cta_title: string;
        over_ons_cta_text: string;
        _method: string;
    }>({
        hero_background_url: settings.hero_background_url ?? '',
        hero_background_image: null,
        hero_title: settings.hero_title ?? '',
        hero_subtitle: settings.hero_subtitle ?? '',
        hero_description: settings.hero_description ?? '',
        instagram_business_account_id: settings.instagram_business_account_id ?? '',
        instagram_page_access_token: settings.instagram_page_access_token ?? '',
        instagram_hashtags: settings.instagram_hashtags ?? '',
        over_ons_hero_title: settings.over_ons_hero_title ?? '',
        over_ons_hero_intro: settings.over_ons_hero_intro ?? '',
        over_ons_hero_image: settings.over_ons_hero_image ?? '',
        over_ons_hero_year: settings.over_ons_hero_year ?? '',
        over_ons_mission_title: settings.over_ons_mission_title ?? '',
        over_ons_mission_text: settings.over_ons_mission_text ?? '',
        over_ons_pillar_1_title: settings.over_ons_pillar_1_title ?? '',
        over_ons_pillar_1_text: settings.over_ons_pillar_1_text ?? '',
        over_ons_pillar_2_title: settings.over_ons_pillar_2_title ?? '',
        over_ons_pillar_2_text: settings.over_ons_pillar_2_text ?? '',
        over_ons_pillar_3_title: settings.over_ons_pillar_3_title ?? '',
        over_ons_pillar_3_text: settings.over_ons_pillar_3_text ?? '',
        over_ons_story_title: settings.over_ons_story_title ?? '',
        over_ons_story_image: settings.over_ons_story_image ?? '',
        over_ons_story_text: settings.over_ons_story_text ?? '',
        over_ons_cta_title: settings.over_ons_cta_title ?? '',
        over_ons_cta_text: settings.over_ons_cta_text ?? '',
        _method: 'PUT',
    });

    const tokenForm = useForm<{ user_access_token: string }>({ user_access_token: '' });

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
            forceFormData: data.hero_background_image !== null,
        });
    };

    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: 'homepage', label: 'Homepage', icon: '🏠' },
        { id: 'over-ons', label: 'Over Ons', icon: '👨‍👩‍👧' },
        { id: 'instagram', label: 'Instagram', icon: '📸' },
    ];

    const inputClass = 'w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500 transition';
    const labelClass = 'block text-sm font-medium text-gray-300 mb-2';

    return (
        <AdminLayout header={<h2 className="text-lg font-semibold text-white">Site Instellingen</h2>}>
            <Head title="Site Instellingen" />

            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-3xl space-y-6">

                    {flash?.success && (
                        <div className="bg-emerald-900/40 border border-emerald-700 text-emerald-300 px-4 py-3 rounded-xl text-sm">
                            ✅ {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
                            ❌ {flash.error}
                        </div>
                    )}

                    {/* Tab Navigation */}
                    <div className="flex gap-1 bg-[#0f1117] border border-gray-800 rounded-xl p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                                    activeTab === tab.id
                                        ? 'bg-violet-600 text-white shadow'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={submit} noValidate className="space-y-6">

                        {/* ── HOMEPAGE TAB ── */}
                        {activeTab === 'homepage' && (
                          <>
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
                                        type="text"
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
                            <button type="submit" disabled={processing} className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition">
                                {processing ? 'Opslaan...' : 'Instellingen opslaan'}
                            </button>
                        </div>
                          </>
                        )}

                        {/* ── OVER ONS TAB ── */}
                        {activeTab === 'over-ons' && (
                          <>
                            {/* Hero */}
                            <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
                                    <h3 className="text-base font-semibold text-white">Hero Sectie</h3>
                                </div>
                                <div>
                                    <label className={labelClass}>Titel</label>
                                    <input type="text" value={data.over_ons_hero_title} onChange={(e) => setData('over_ons_hero_title', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Intro tekst</label>
                                    <textarea value={data.over_ons_hero_intro} onChange={(e) => setData('over_ons_hero_intro', e.target.value)} rows={3} className={`${inputClass} resize-none`} />
                                </div>
                                <div>
                                    <label className={labelClass}>Foto</label>
                                    <ImageUpload
                                        value={data.over_ons_hero_image}
                                        onChange={(url) => setData('over_ons_hero_image', url)}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Jaar label <span className="text-gray-500 font-normal">(bijv. "Sinds 2023")</span></label>
                                    <input type="text" value={data.over_ons_hero_year} onChange={(e) => setData('over_ons_hero_year', e.target.value)} placeholder="Sinds 2023" className={inputClass} />
                                </div>
                            </div>

                            {/* Missie */}
                            <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full" />
                                    <h3 className="text-base font-semibold text-white">Missie Sectie</h3>
                                </div>
                                <div>
                                    <label className={labelClass}>Titel</label>
                                    <input type="text" value={data.over_ons_mission_title} onChange={(e) => setData('over_ons_mission_title', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Tekst</label>
                                    <textarea value={data.over_ons_mission_text} onChange={(e) => setData('over_ons_mission_text', e.target.value)} rows={3} className={`${inputClass} resize-none`} />
                                </div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider pt-2">Drie kernwaarden</p>
                                {([
                                    { n: 1, titleKey: 'over_ons_pillar_1_title' as const, textKey: 'over_ons_pillar_1_text' as const },
                                    { n: 2, titleKey: 'over_ons_pillar_2_title' as const, textKey: 'over_ons_pillar_2_text' as const },
                                    { n: 3, titleKey: 'over_ons_pillar_3_title' as const, textKey: 'over_ons_pillar_3_text' as const },
                                ]).map(({ n, titleKey, textKey }) => (
                                    <div key={n} className="bg-[#0f1117] rounded-lg p-4 space-y-3 border border-gray-800">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Kernwaarde {n}</p>
                                        <div>
                                            <label className={labelClass}>Titel</label>
                                            <input type="text" value={data[titleKey]} onChange={(e) => setData(titleKey, e.target.value)} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Beschrijving</label>
                                            <textarea value={data[textKey]} onChange={(e) => setData(textKey, e.target.value)} rows={2} className={`${inputClass} resize-none`} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Verhaal */}
                            <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-500 rounded-full" />
                                    <h3 className="text-base font-semibold text-white">Verhaal Sectie</h3>
                                </div>
                                <div>
                                    <label className={labelClass}>Titel</label>
                                    <input type="text" value={data.over_ons_story_title} onChange={(e) => setData('over_ons_story_title', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Foto</label>
                                    <ImageUpload
                                        value={data.over_ons_story_image}
                                        onChange={(url) => setData('over_ons_story_image', url)}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Verhaal tekst <span className="text-gray-500 font-normal">(gebruik een lege regel voor een nieuw alinea)</span></label>
                                    <textarea value={data.over_ons_story_text} onChange={(e) => setData('over_ons_story_text', e.target.value)} rows={8} className={`${inputClass} resize-y`} />
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-6 bg-gradient-to-b from-pink-400 to-rose-500 rounded-full" />
                                    <h3 className="text-base font-semibold text-white">CTA Sectie</h3>
                                </div>
                                <div>
                                    <label className={labelClass}>Titel</label>
                                    <input type="text" value={data.over_ons_cta_title} onChange={(e) => setData('over_ons_cta_title', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Tekst</label>
                                    <textarea value={data.over_ons_cta_text} onChange={(e) => setData('over_ons_cta_text', e.target.value)} rows={2} className={`${inputClass} resize-none`} />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button type="submit" disabled={processing} className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition">
                                    {processing ? 'Opslaan...' : 'Instellingen opslaan'}
                                </button>
                            </div>
                          </>
                        )}

                        {/* ── INSTAGRAM TAB ── */}
                        {activeTab === 'instagram' && (
                          <>
                        {/* Instagram Instellingen */}
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-6 bg-gradient-to-b from-pink-400 to-purple-500 rounded-full" />
                                <h3 className="text-base font-semibold text-white">Instagram Instellingen</h3>
                            </div>
                            <p className="text-xs text-gray-500">
                                Vul hieronder je Instagram Business Account ID en Page Access Token in om verhalen te kunnen delen op Instagram.
                            </p>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Instagram Business Account ID</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    value={data.instagram_business_account_id}
                                    onChange={(e) => setData('instagram_business_account_id', e.target.value)}
                                    placeholder="17841432578328591"
                                    className="w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Page Access Token</label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    value={data.instagram_page_access_token}
                                    onChange={(e) => setData('instagram_page_access_token', e.target.value)}
                                    placeholder="EAAWPw..."
                                    className="w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition"
                                />
                                <p className="mt-1 text-xs text-gray-600">Laat leeg om de huidige te bewaren.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Standaard hashtags</label>
                                <textarea
                                    value={data.instagram_hashtags}
                                    onChange={(e) => setData('instagram_hashtags', e.target.value)}
                                    rows={3}
                                    placeholder="#deongeplanderoute #weekenduitje #nederlandseblog"
                                    className="w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition text-sm resize-none"
                                />
                                <p className="mt-1 text-xs text-gray-600">Worden automatisch toegevoegd aan elk Instagram bericht. Gebruik spaties tussen hashtags.</p>
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
                          </>
                        )}
                    </form>

                    {/* Token uitwisselen — aparte actie, buiten de hoofdform */}
                    {activeTab === 'instagram' && (
                    <div className="bg-[#16181f] border border-pink-900/40 rounded-xl p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-gradient-to-b from-pink-400 to-purple-500 rounded-full" />
                            <h3 className="text-base font-semibold text-white">Instagram Token vernieuwen</h3>
                        </div>

                        {settings.instagram_token_obtained_at && (
                            <p className="text-xs text-gray-500">
                                Laatste token opgeslagen op:{' '}
                                <span className="text-gray-400">
                                    {new Date(settings.instagram_token_obtained_at).toLocaleString('nl-NL')}
                                </span>
                            </p>
                        )}

                        <div className="bg-[#0f1117] rounded-lg p-4 border border-gray-800 space-y-2 text-xs text-gray-400 leading-relaxed">
                            <p className="font-semibold text-gray-300">Hoe haal je een nieuwe token op?</p>
                            <ol className="list-decimal list-inside space-y-1">
                                <li>
                                    Ga naar{' '}
                                    <a
                                        href="https://developers.facebook.com/tools/explorer/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-pink-400 hover:underline"
                                    >
                                        Graph API Explorer
                                    </a>
                                </li>
                                <li>Selecteer jouw app (<strong className="text-gray-300">2136657173841416</strong>) rechtsboven</li>
                                <li>Klik op <strong className="text-gray-300">Generate Access Token</strong></li>
                                <li>Geef toestemming voor: <code className="text-pink-300">pages_manage_posts</code>, <code className="text-pink-300">instagram_basic</code>, <code className="text-pink-300">instagram_content_publish</code></li>
                                <li>Kopieer de gegenereerde token en plak hem hieronder</li>
                            </ol>
                            <p className="text-gray-600 mt-2">De server wisselt de token automatisch om naar een token die <strong className="text-gray-400">nooit verloopt</strong>.</p>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                tokenForm.post(exchangeInstagramToken.url(), {
                                    onSuccess: () => tokenForm.reset(),
                                });
                            }}
                            className="space-y-3"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Kortstondige User Access Token (van Graph API Explorer)
                                </label>
                                <textarea
                                    value={tokenForm.data.user_access_token}
                                    onChange={(e) => tokenForm.setData('user_access_token', e.target.value)}
                                    rows={3}
                                    placeholder="EAAWPw..."
                                    className="w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-pink-500 transition text-xs font-mono resize-none"
                                />
                                {tokenForm.errors.user_access_token && (
                                    <p className="mt-1 text-xs text-red-400">{tokenForm.errors.user_access_token}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={tokenForm.processing || !tokenForm.data.user_access_token}
                                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
                            >
                                {tokenForm.processing ? 'Uitwisselen...' : '🔄 Token uitwisselen & opslaan'}
                            </button>
                        </form>
                    </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
