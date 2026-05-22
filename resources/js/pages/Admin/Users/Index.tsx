import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useCallback, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    email_verified_at: string | null;
    created_at: string;
}

interface UsersIndexProps {
    users: { data: User[]; links: any[]; meta: any };
    filters: { search?: string };
}

export default function UsersIndex({ users, filters }: UsersIndexProps) {
    const { auth } = usePage().props as any;
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
        router.get('/admin/users', { search: value }, { preserveState: true, replace: true });
    }, []);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Weet je zeker dat je "${name}" wilt verwijderen?`)) {
            router.delete(`/admin/users/${id}`);
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-lg font-semibold text-white">Gebruikersbeheer</h2>
                    <Link
                        href="/admin/users/create"
                        className="flex items-center space-x-2 p-2 sm:px-4 sm:py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition shadow-lg hover:shadow-emerald-500/20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden sm:inline">Nieuwe Gebruiker</span>
                    </Link>
                </div>
            }
        >
            <Head title="Gebruikers" />

            <div className="p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6">
                        <div className="relative max-w-sm">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Zoek op naam of e-mail..."
                                className="w-full pl-10 pr-4 py-2 bg-[#16181f] border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
                            />
                        </div>
                    </div>

                    {users.data.length === 0 ? (
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-12 text-center">
                            <div className="text-5xl mb-4">👥</div>
                            <p className="text-gray-400 mb-6 text-lg">{search ? `Geen gebruikers gevonden voor "${search}".` : 'Nog geen gebruikers aangemaakt.'}</p>
                            {!search && (
                                <Link href="/admin/users/create" className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-medium">
                                    Gebruiker aanmaken
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px]">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Naam</th>
                                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">E-mail</th>
                                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Rol</th>
                                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Aangemeld</th>
                                        <th className="px-5 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/[0.02] transition">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-semibold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-medium text-white">{user.name}</span>
                                                    {user.id === auth?.user?.id && (
                                                        <span className="text-xs text-gray-600">(jij)</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-400">{user.email}</td>
                                            <td className="px-5 py-4">
                                                {user.is_admin ? (
                                                    <span className="px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-medium">Admin</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 text-xs bg-gray-700/50 text-gray-400 border border-gray-700 rounded font-medium">Gebruiker</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString('nl-NL')}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/users/${user.id}/edit`}
                                                        className="p-1.5 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition"
                                                        title="Bewerk"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    {user.id !== auth?.user?.id && (
                                                        <button
                                                            onClick={() => handleDelete(user.id, user.name)}
                                                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition"
                                                            title="Verwijder"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    )}

                    {users.meta?.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {users.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url ?? '#'}
                                    className={`px-3 py-1.5 text-sm rounded-lg transition ${link.active ? 'bg-emerald-500 text-white' : link.url ? 'bg-[#16181f] border border-gray-700 text-gray-300 hover:border-emerald-500/50' : 'bg-[#16181f] border border-gray-800 text-gray-600 cursor-not-allowed'}`}
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
