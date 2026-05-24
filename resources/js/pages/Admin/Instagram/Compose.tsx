import AdminLayout from '@/Layouts/AdminLayout';
import MediaPicker from '@/Components/MediaPicker';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { post as instagramPost } from '@/actions/App/Http/Controllers/Admin/InstagramController';

interface MediaImage {
    id: number;
    url: string;
    filename: string;
}

interface Props {
    mediaImages: MediaImage[];
}

interface FormData {
    image_url: string;
    caption: string;
    [key: string]: unknown;
}

const DEFAULT_HASHTAGS = '#deongeplanderoute #weekenduitje #nederlandseblog #uitje #reisverhaal';

export default function InstagramCompose({ mediaImages }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [pickerOpen, setPickerOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        image_url: '',
        caption: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(instagramPost.url(), {
            onSuccess: () => reset('caption'),
        });
    };

    const captionLength = data.caption.length;
    const captionWithHashtags = data.caption
        ? data.caption + (data.caption.endsWith('\n') ? '' : '\n\n') + DEFAULT_HASHTAGS
        : '';

    return (
        <AdminLayout header={<h2 className="text-lg font-semibold text-white">📸 Instagram Posten</h2>}>
            <Head title="Instagram Posten" />

            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-4xl">

                    {flash?.success && (
                        <div className="mb-6 bg-emerald-900/40 border border-emerald-700 text-emerald-300 px-4 py-3 rounded-xl text-sm">
                            ✅ {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
                            ❌ {flash.error}
                        </div>
                    )}

                    <form onSubmit={submit} noValidate>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Left — image picker */}
                            <div className="space-y-4">
                                <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full" />
                                        <h3 className="text-base font-semibold text-white">Foto kiezen</h3>
                                    </div>

                                    {data.image_url ? (
                                        <div className="relative group">
                                            <img
                                                src={data.image_url}
                                                alt="Geselecteerde foto"
                                                className="w-full aspect-square object-cover rounded-xl"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition">
                                                <button
                                                    type="button"
                                                    onClick={() => setPickerOpen(true)}
                                                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium backdrop-blur-sm"
                                                >
                                                    Andere foto kiezen
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setPickerOpen(true)}
                                            className="w-full aspect-square border-2 border-dashed border-gray-700 hover:border-pink-500 rounded-xl flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-pink-400 transition group"
                                        >
                                            <span className="text-4xl group-hover:scale-110 transition">📷</span>
                                            <span className="text-sm font-medium">Klik om een foto te kiezen</span>
                                            <span className="text-xs text-gray-600">Uit mediabibliotheek</span>
                                        </button>
                                    )}

                                    {errors.image_url && (
                                        <p className="mt-2 text-red-400 text-xs">{errors.image_url}</p>
                                    )}
                                </div>

                                {/* Recent media shortcuts */}
                                {mediaImages.length > 0 && (
                                    <div className="bg-[#16181f] border border-gray-800 rounded-xl p-4">
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Recente foto's</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {mediaImages.slice(0, 8).map((img) => (
                                                <button
                                                    key={img.id}
                                                    type="button"
                                                    onClick={() => setData('image_url', img.url)}
                                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                                                        data.image_url === img.url
                                                            ? 'border-pink-500'
                                                            : 'border-transparent hover:border-gray-600'
                                                    }`}
                                                >
                                                    <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                        {mediaImages.length > 8 && (
                                            <button
                                                type="button"
                                                onClick={() => setPickerOpen(true)}
                                                className="mt-3 w-full text-xs text-gray-500 hover:text-gray-300 transition text-center"
                                            >
                                                Meer foto's bekijken →
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right — caption + preview */}
                            <div className="space-y-4">
                                {/* Caption */}
                                <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full" />
                                        <h3 className="text-base font-semibold text-white">Beschrijving</h3>
                                    </div>

                                    <textarea
                                        value={data.caption}
                                        onChange={(e) => setData('caption', e.target.value)}
                                        rows={6}
                                        placeholder="Schrijf hier je caption... ✨&#10;&#10;Beschrijf de foto, de sfeer, de locatie."
                                        className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition text-sm resize-none"
                                        maxLength={2200}
                                    />
                                    <div className="flex justify-between mt-1.5">
                                        {errors.caption
                                            ? <p className="text-red-400 text-xs">{errors.caption}</p>
                                            : <span />
                                        }
                                        <span className={`text-xs ${captionLength > 2000 ? 'text-red-400' : 'text-gray-600'}`}>
                                            {captionLength}/2200
                                        </span>
                                    </div>

                                    {/* Hashtag preview */}
                                    <div className="mt-4 p-3 bg-[#0f1117] rounded-lg border border-gray-800">
                                        <p className="text-xs text-gray-600 mb-1.5">Automatisch toegevoegde hashtags:</p>
                                        <p className="text-xs text-blue-400 leading-relaxed">{DEFAULT_HASHTAGS}</p>
                                    </div>
                                </div>

                                {/* Instagram preview */}
                                {data.image_url && (
                                    <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6">
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-4">Voorbeeld</p>
                                        <div className="bg-[#0f1117] rounded-xl overflow-hidden border border-gray-800 max-w-sm mx-auto">
                                            {/* Instagram header */}
                                            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                                                    OR
                                                </div>
                                                <span className="text-white text-sm font-medium">deongeplanderoute</span>
                                            </div>
                                            <img src={data.image_url} alt="Preview" className="w-full aspect-square object-cover" />
                                            {captionWithHashtags && (
                                                <div className="px-4 py-3">
                                                    <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-line line-clamp-4">
                                                        {captionWithHashtags}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Post button */}
                                <button
                                    type="submit"
                                    disabled={processing || !data.image_url || !data.caption}
                                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition text-sm flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Posten...
                                        </>
                                    ) : (
                                        <>📸 Posten op Instagram</>
                                    )}
                                </button>
                                {(!data.image_url || !data.caption) && (
                                    <p className="text-center text-xs text-gray-600">
                                        {!data.image_url ? 'Kies eerst een foto' : 'Voeg een beschrijving toe'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <MediaPicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={(url) => {
                    setData('image_url', url);
                    setPickerOpen(false);
                }}
            />
        </AdminLayout>
    );
}
