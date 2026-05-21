import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
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

export default function BlogIndex({ posts }: Props) {
    const handleDelete = (id: number, title: string) => {
        if (confirm(`Weet je zeker dat je "${title}" wilt verwijderen?`)) {
            router.delete(`/admin/blog/${id}`);
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-lg font-semibold text-white">Blog Beheren</h2>
                    <Link
                        href="/admin/blog/create"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition shadow-lg"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nieuw Blogpost
                    </Link>
                </div>
            }
        >
            <Head title="Blog Beheren" />

            <div className="p-6 lg:p-8">
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
                                    className="flex items-center gap-4 bg-gray-800 rounded-xl px-5 py-4 border border-gray-700"
                                >
                                    {/* Thumbnail */}
                                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-700 shrink-0">
                                        {post.featured_image ? (
                                            <img
                                                src={post.featured_image}
                                                alt={post.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">
                                                📝
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{post.title}</p>
                                        {post.excerpt && (
                                            <p className="text-gray-400 text-sm truncate mt-0.5">{post.excerpt}</p>
                                        )}
                                        <p className="text-gray-500 text-xs mt-1">
                                            {formatDate(post.created_at)}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <span
                                        className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            post.status === 'published'
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-gray-600 text-gray-300'
                                        }`}
                                    >
                                        {post.status === 'published' ? '🟢 Gepubliceerd' : '⚪ Concept'}
                                    </span>

                                    {/* Actions */}
                                    <div className="shrink-0 flex items-center gap-2">
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
