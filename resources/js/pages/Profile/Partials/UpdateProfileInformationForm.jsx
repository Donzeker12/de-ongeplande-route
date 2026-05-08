import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
    isAdmin = false,
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    const headerStyle = isAdmin ? 'text-xl font-medium text-white' : 'text-lg font-medium text-gray-900';
    const subHeaderStyle = isAdmin ? 'mt-1 text-sm text-gray-300' : 'mt-1 text-sm text-gray-600';
    const inputStyle = isAdmin 
        ? 'mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
        : 'mt-1 block w-full';
    const labelStyle = isAdmin ? 'block text-sm font-medium text-gray-200 mb-2' : '';
    const buttonStyle = isAdmin 
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]'
        : '';

    return (
        <section className={className}>
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    {isAdmin && <span className="text-2xl">👤</span>}
                    <h2 className={headerStyle}>
                        {isAdmin ? 'Account Informatie' : 'Profile Information'}
                    </h2>
                </div>

                <p className={subHeaderStyle}>
                    {isAdmin 
                        ? 'Beheer je account naam en e-mailadres.'
                        : 'Update your account\'s profile information and email address.'
                    }
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    {isAdmin ? (
                        <label className={labelStyle}>Naam</label>
                    ) : (
                        <InputLabel htmlFor="name" value="Name" />
                    )}

                    {isAdmin ? (
                        <input
                            id="name"
                            className={inputStyle}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoFocus
                            autoComplete="name"
                            placeholder="Je volledige naam"
                        />
                    ) : (
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                        />
                    )}

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    {isAdmin ? (
                        <label className={labelStyle}>E-mailadres</label>
                    ) : (
                        <InputLabel htmlFor="email" value="Email" />
                    )}

                    {isAdmin ? (
                        <input
                            id="email"
                            type="email"
                            className={inputStyle}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                            placeholder="je@email.com"
                        />
                    ) : (
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                    )}

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className={`mt-2 text-sm ${isAdmin ? 'text-yellow-300' : 'text-gray-800'}`}>
                            {isAdmin 
                                ? 'Je e-mailadres is nog niet geverifieerd.'
                                : 'Your email address is unverified.'
                            }
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className={`ml-2 rounded-md text-sm underline focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    isAdmin 
                                        ? 'text-blue-400 hover:text-blue-300 focus:ring-blue-500'
                                        : 'text-gray-600 hover:text-gray-900 focus:ring-indigo-500'
                                }`}
                            >
                                {isAdmin 
                                    ? 'Klik hier om verificatie e-mail te verzenden.'
                                    : 'Click here to re-send the verification email.'
                                }
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className={`mt-2 text-sm font-medium ${
                                isAdmin ? 'text-green-400' : 'text-green-600'
                            }`}>
                                {isAdmin 
                                    ? 'Een nieuwe verificatielink is naar je e-mailadres verzonden.'
                                    : 'A new verification link has been sent to your email address.'
                                }
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-4">
                    {isAdmin ? (
                        <button
                            type="submit"
                            disabled={processing}
                            className={buttonStyle}
                        >
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Opslaan...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>💾</span>
                                    Wijzigingen opslaan
                                </div>
                            )}
                        </button>
                    ) : (
                        <PrimaryButton disabled={processing}>Save</PrimaryButton>
                    )}

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className={`text-sm ${isAdmin ? 'text-green-400' : 'text-gray-600'}`}>
                            {isAdmin ? '✅ Opgeslagen!' : 'Saved.'}
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
