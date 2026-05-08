import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.is_admin;

    const Layout = isAdmin ? AdminLayout : AuthenticatedLayout;
    const headerStyle = isAdmin ? 'text-xl font-semibold text-white' : 'text-xl font-semibold leading-tight text-gray-800';
    const bgStyle = isAdmin ? 'bg-gray-800 border border-gray-700' : 'bg-white';
    const containerStyle = isAdmin ? 'bg-gray-900 min-h-screen' : '';

    return (
        <Layout
            header={
                <h2 className={headerStyle}>
                    {isAdmin ? '👤 Admin Profiel' : 'Profile'}
                </h2>
            }
        >
            <Head title="Profile" />

            <div className={`py-12 ${containerStyle}`}>
                <div className="mx-auto max-w-4xl space-y-8 sm:px-6 lg:px-8">
                    {isAdmin && (
                        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700 rounded-2xl p-6 text-blue-200">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">🛡️</span>
                                <h3 className="text-lg font-semibold text-white">Admin Account</h3>
                            </div>
                            <p className="text-blue-300">
                                Je hebt volledige beheerdersrechten over "De Ongeplande Route" platform.
                            </p>
                        </div>
                    )}

                    <div className={`${bgStyle} p-6 shadow-lg sm:rounded-2xl sm:p-8 ${isAdmin ? 'shadow-2xl shadow-black/20' : ''}`}>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-2xl"
                            isAdmin={isAdmin}
                        />
                    </div>

                    <div className={`${bgStyle} p-6 shadow-lg sm:rounded-2xl sm:p-8 ${isAdmin ? 'shadow-2xl shadow-black/20' : ''}`}>
                        <UpdatePasswordForm 
                            className="max-w-2xl" 
                            isAdmin={isAdmin}
                        />
                    </div>

                    <div className={`${bgStyle} p-6 shadow-lg sm:rounded-2xl sm:p-8 ${isAdmin ? 'shadow-2xl shadow-black/20' : ''}`}>
                        <DeleteUserForm 
                            className="max-w-2xl" 
                            isAdmin={isAdmin}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
