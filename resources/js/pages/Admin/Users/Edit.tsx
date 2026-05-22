import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
}

interface UsersEditProps {
    user: User;
}

export default function UsersEdit({ user }: UsersEditProps) {
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        is_admin: user.is_admin,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(`/admin/users/${user.id}`);
    };

    return (
        <AdminLayout
            header={<h2 className="text-lg font-semibold text-white">Gebruiker bewerken</h2>}
        >
            <Head title="Gebruiker bewerken" />

            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-2xl">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="bg-[#16181f] border border-gray-800 rounded-xl p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Naam</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-emerald-500 transition"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">E-mailadres</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-emerald-500 transition"
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Nieuw wachtwoord <span className="text-gray-600 font-normal">(laat leeg om niet te wijzigen)</span>
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="new-password"
                                    className="w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-emerald-500 transition"
                                />
                                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                            </div>

                            {data.password && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Bevestig nieuw wachtwoord</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        autoComplete="new-password"
                                        className="w-full px-3 py-2 bg-[#0f1117] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-emerald-500 transition"
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-between p-4 bg-[#0f1117] border border-gray-700 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-300">Admin rechten</p>
                                    <p className="text-xs text-gray-600 mt-0.5">Geeft toegang tot het admin panel</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('is_admin', !data.is_admin)}
                                    className={`relative inline-flex w-11 h-6 items-center rounded-full transition-colors ${data.is_admin ? 'bg-emerald-500' : 'bg-gray-700'}`}
                                >
                                    <span className={`inline-block w-4 h-4 bg-white rounded-full transition-transform ${data.is_admin ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <a href="/admin/users" className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition">Annuleren</a>
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
