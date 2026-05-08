import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Outing {
    id: number;
    title: string;
}

interface Snippet {
    id: number;
    outing_id: number | null;
    platform: string;
    hook_text: string;
    caption: string;
    teaser_content: string | null;
    published_at: string | null;
}

interface SnippetsEditProps {
    snippet: Snippet;
    outings: Outing[];
}

const platforms = [
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'instagram', label: 'Instagram', icon: '📸' },
    { value: 'facebook', label: 'Facebook', icon: '👍' },
];

export default function SnippetsEdit({ snippet, outings }: SnippetsEditProps) {
    const { data, setData, patch, processing, errors } = useForm({
        outing_id: snippet.outing_id?.toString() ?? '',
        platform: snippet.platform,
        hook_text: snippet.hook_text,
        caption: snippet.caption,
        teaser_content: snippet.teaser_content ?? '',
        published_at: snippet.published_at ? snippet.published_at.replace(' ', 'T').substring(0, 16) : '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(`/admin/snippets/${snippet.id}`);
    };

    return (
        <AdminLayout
            header={<h2 className="text-lg font-semibold text-white">Snippet bewerken</h2>}
        >
            <Head title="Snippet bewerken" />

            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-3xl">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Outing</label>
                                <select
                                    value={data.outing_id}
                                    onChange={(e) => setData('outing_id', e.target.value)}
                                    className="w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-emerald-500 transition"
                                >
                                    <option value="">— Geen koppeling —</option>
                                    {outings.map((o) => (
                                        <option key={o.id} value={o.id}>{o.title}</option>
                                    ))}
                                </select>
                                {errors.outing_id && <p className="mt-1 text-xs text-red-400">{errors.outing_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                                <div className="flex gap-3">
                                    {platforms.map((p) => (
                                        <button
                                            key={p.value}
                                            type="button"
                                            onClick={() => setData('platform', p.value)}
                                            className={`flex-1 py-2 text-sm rounded-lg border transition font-medium ${data.platform === p.value ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-[#0f1117] border-gray-700 text-gray-400 hover:border-gray-600'}`}
                                        >
                                            {p.icon} {p.label}
                                        </button>
                                    ))}
                                </div>
                                {errors.platform && <p className="mt-1 text-xs text-red-400">{errors.platform}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Hook tekst</label>
                                <input
                                    type="text"
                                    value={data.hook_text}
                                    onChange={(e) => setData('hook_text', e.target.value)}
                                    className="w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                                />
                                {errors.hook_text && <p className="mt-1 text-xs text-red-400">{errors.hook_text}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Caption</label>
                                <textarea
                                    value={data.caption}
                                    onChange={(e) => setData('caption', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition resize-none"
                                />
                                {errors.caption && <p className="mt-1 text-xs text-red-400">{errors.caption}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Teaser inhoud <span className="text-gray-600 font-normal">(optioneel)</span></label>
                                <textarea
                                    value={data.teaser_content}
                                    onChange={(e) => setData('teaser_content', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition resize-none"
                                />
                                {errors.teaser_content && <p className="mt-1 text-xs text-red-400">{errors.teaser_content}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Publicatiedatum <span className="text-gray-600 font-normal">(optioneel)</span></label>
                                <input
                                    type="datetime-local"
                                    value={data.published_at}
                                    onChange={(e) => setData('published_at', e.target.value)}
                                    className="w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-emerald-500 transition [color-scheme:dark]"
                                />
                                {errors.published_at && <p className="mt-1 text-xs text-red-400">{errors.published_at}</p>}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <a href="/admin/snippets" className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition">Annuleren</a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition disabled:opacity-50"
                            >
                                {processing ? 'Opslaan...' : 'Wijzigingen opslaan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
