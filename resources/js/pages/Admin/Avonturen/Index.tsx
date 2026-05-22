import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Post {
    id: number;
    title: string;
    status: string;
    user: { id: number; name: string };
}

interface Avontuur {
    id: number;
    title: string;
    location: string | null;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    user: { id: number; name: string };
    posts: Post[];
}

interface Props {
    avonturen: Avontuur[];
}

export default function AvonturenIndex({ avonturen }: Props) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const [expanded, setExpanded] = useState<number | null>(null);

    const createForm = useForm({
        title: '',
        location: '',
        description: '',
        start_date: '',
        end_date: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/avonturen', {
            onSuccess: () => createForm.reset(),
        });
    };

    return (
        <AdminLayout header={<h2 className="text-xl font-semibold">🗺️ Avonturen</h2>}>
            <Head title="Avonturen" />

            <div className="max-w-3xl mx-auto p-4 space-y-6">
                {props.flash?.success && (
                    <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-xl flex items-center gap-2">
                        <span>✅</span>
                        <span>{props.flash.success}</span>
                    </div>
                )}

                {/* Nieuw avontuur */}
                <div className="bg-[#1a1d27] border border-gray-700 rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-gray-300 mb-4">+ Nieuw avontuur aanmaken</h3>
                    <form onSubmit={handleCreate} className="space-y-3">
                        <input
                            type="text"
                            value={createForm.data.title}
                            onChange={(e) => createForm.setData('title', e.target.value)}
                            placeholder="Naam (bijv. Ardennen weekend)"
                            className="w-full bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                        />
                        {createForm.errors.title && <p className="text-red-400 text-xs">{createForm.errors.title}</p>}
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                value={createForm.data.location}
                                onChange={(e) => createForm.setData('location', e.target.value)}
                                placeholder="Locatie"
                                className="bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                            />
                            <input
                                type="date"
                                value={createForm.data.start_date}
                                onChange={(e) => createForm.setData('start_date', e.target.value)}
                                className="bg-[#0f1117] border border-gray-700 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={createForm.processing || !createForm.data.title.trim()}
                            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl text-sm transition"
                        >
                            Aanmaken
                        </button>
                    </form>
                </div>

                {/* Lijst */}
                {avonturen.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">Nog geen avonturen aangemaakt.</p>
                ) : (
                    <div className="space-y-3">
                        {avonturen.map((avontuur) => (
                            <div key={avontuur.id} className="bg-[#1a1d27] border border-gray-700 rounded-2xl overflow-hidden">
                                {/* Header */}
                                <button
                                    type="button"
                                    onClick={() => setExpanded(expanded === avontuur.id ? null : avontuur.id)}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-800/30 transition"
                                >
                                    <div>
                                        <p className="font-semibold text-white">{avontuur.title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {avontuur.location && <span>📍 {avontuur.location} · </span>}
                                            {avontuur.start_date && <span>📅 {avontuur.start_date} · </span>}
                                            <span>{avontuur.posts.length} notitie{avontuur.posts.length !== 1 ? 's' : ''} · door {avontuur.user.name}</span>
                                        </p>
                                    </div>
                                    <span className="text-gray-500 text-sm ml-4">{expanded === avontuur.id ? '▲' : '▼'}</span>
                                </button>

                                {/* Posts */}
                                {expanded === avontuur.id && (
                                    <div className="border-t border-gray-800 px-5 py-4 space-y-2">
                                        {avontuur.posts.length === 0 ? (
                                            <p className="text-sm text-gray-500">Nog geen posts gekoppeld.</p>
                                        ) : (
                                            avontuur.posts.map((post) => (
                                                <Link
                                                    key={post.id}
                                                    href={`/admin/blog/${post.id}/edit`}
                                                    className="flex items-center justify-between px-3 py-2.5 bg-gray-800/60 hover:bg-gray-700/60 rounded-xl transition group"
                                                >
                                                    <div>
                                                        <p className="text-sm text-gray-200 group-hover:text-white">{post.title}</p>
                                                        <p className="text-xs text-gray-500">{post.user.name} · {post.status}</p>
                                                    </div>
                                                    <span className="text-xs text-gray-500 shrink-0 ml-2">Bewerken →</span>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
