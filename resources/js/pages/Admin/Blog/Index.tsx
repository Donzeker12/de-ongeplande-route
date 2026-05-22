import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    featured_image: string | null;
    status: 'draft' | 'published';
    published_at: string | null;
    created_at: string;
}

interface Props {
    posts: {
        data: Post[];
        links: { url: string | null; label: string; active: boolean }[];
        last_page: number;
        current_page: number;
        total: number;
    };
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function PreviewDrawer({ post, onClose }: { post: Post; onClose: () => void }) {
    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer: bottom sheet on mobile, centered modal on md+ */}
            <div className="fixed z-50 inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center md:p-6">
                <div className="bg-[#16181f] w-full md:max-w-2xl md:rounded-2xl rounded-t-2xl border border-gray-700 flex flex-col max-h-[90vh] shadow-2xl">

                    {/* Header bar */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
                        <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                post.status === 'published'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-gray-600/60 text-gray-300'
                            }`}>
                                {post.status === 'published' ? '🟢 Gepubliceerd' : '⚪ Concept'}
                            </span>
                            <span className="text-gray-500 text-xs">{formatDate(post.created_at)}</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Scrollable content */}
                    <div className="overflow-y-auto flex-1 px-5 py-5 space-y-4">
                        {post.featured_image && (
                            <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full rounded-xl object-cover max-h-52"
                            />
                        )}
                        <h1 className="text-xl font-bold text-white leading-snug">{post.title}</h1>
                        {post.excerpt && (
                            <p className="text-gray-400 text-sm italic border-l-2 border-amber-500 pl-3">{post.excerpt}</p>
                        )}
                        {post.content ? (
                            <div
                                className="prose prose-invert prose-sm max-w-none text-gray-300 prose-headings:text-white prose-a:text-amber-400 prose-img:rounded-xl"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        ) : (
                            <p className="text-gray-500 italic text-sm">Nog geen inhoud.</p>
                        )}
                    </div>

                    {/* Footer actions */}
                    <div className="border-t border-gray-800 px-5 py-4 flex gap-3 shrink-0">
                        <Link
                            href={`/admin/blog/${post.id}/edit`}
                            className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3 rounded-xl text-sm transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Bewerken
                        </Link>
                        {post.status === 'published' && (
                            <a
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-3 rounded-xl text-sm transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Bekijk op site
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default function BlogIndex({ posts }: Props) {
    const [preview, setPreview] = useState<Post | null>(null);

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Weet je zeker dat je "${title}" wilt verwijderen?`)) {
            router.delete(`/admin/blog/${id}`);
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-lg font-semibold text-white">Blog</h2>
                    <Link
                        href="/admin/blog/create"
                        className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition shadow-lg"
                    >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden sm:inline">Nieuw blogpost</span>
                        <span className="sm:hidden">Nieuw</span>
                    </Link>
                </div>
            }
        >
            <Head title="Blog Beheren" />

            {preview && <PreviewDrawer post={preview} onClose={() => setPreview(null)} />}

            <div className="p-4 lg:p-8">
                <div className="mx-auto max-w-5xl">
                    {posts.data.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <span className="text-5xl block mb-4">✍️</span>
                            <p className="text-lg">Nog geen blogposts.</p>
                            <Link
                                href="/admin/blog/create"
                                className="mt-4 inline-block px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition text-sm font-medium"
                            >
                                Eerste post schrijven
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {posts.data.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
                                >
                                    {/* Main row: thumbnail + info — click to preview */}
                                    <button
                                        type="button"
                                        onClick={() => setPreview(post)}
                                        className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-700/30 transition"
                                    >
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 shrink-0">
                                            {post.featured_image ? (
                                                <img
                                                    src={post.featured_image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xl">
                                                    📝
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium text-sm leading-snug line-clamp-2">
                                                {post.title || <span className="text-gray-500 italic">Geen titel</span>}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                        post.status === 'published'
                                                            ? 'bg-emerald-500/20 text-emerald-400'
                                                            : 'bg-gray-600/60 text-gray-300'
                                                    }`}
                                                >
                                                    {post.status === 'published' ? '🟢 Gepubliceerd' : '⚪ Concept'}
                                                </span>
                                                <span className="text-gray-500 text-xs">{formatDate(post.created_at)}</span>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Actions row */}
                                    <div className="border-t border-gray-700/50 flex items-center justify-end gap-1 px-3 py-2">
                                        {post.status === 'published' && (
                                            <a
                                                href={`/blog/${post.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-gray-400 hover:text-blue-400 transition"
                                                title="Bekijk op site"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        )}
                                        <Link
                                            href={`/admin/blog/${post.id}/edit`}
                                            className="p-2 text-gray-400 hover:text-white transition"
                                            title="Bewerken"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id, post.title)}
                                            className="p-2 text-gray-400 hover:text-red-400 transition"
                                            title="Verwijderen"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {posts.links.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition ${
                                        link.active
                                            ? 'bg-emerald-500 text-white'
                                            : link.url
                                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
