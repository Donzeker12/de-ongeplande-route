import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '', isAdmin = false }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
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
                    {isAdmin && <span className="text-2xl">🔒</span>}
                    <h2 className={headerStyle}>
                        {isAdmin ? 'Wachtwoord Wijzigen' : 'Update Password'}
                    </h2>
                </div>

                <p className={subHeaderStyle}>
                    {isAdmin 
                        ? 'Zorg dat je account beschermd is met een sterk, uniek wachtwoord.'
                        : 'Ensure your account is using a long, random password to stay secure.'
                    }
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-6">
                <div>
                    {isAdmin ? (
                        <label className={labelStyle}>Huidig Wachtwoord</label>
                    ) : (
                        <InputLabel htmlFor="current_password" value="Current Password" />
                    )}

                    {isAdmin ? (
                        <input
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                            className={inputStyle}
                            autoComplete="current-password"
                            placeholder="Voer je huidige wachtwoord in"
                        />
                    ) : (
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                        />
                    )}

                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    {isAdmin ? (
                        <label className={labelStyle}>Nieuw Wachtwoord</label>
                    ) : (
                        <InputLabel htmlFor="password" value="New Password" />
                    )}

                    {isAdmin ? (
                        <input
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className={inputStyle}
                            autoComplete="new-password"
                            placeholder="Kies een sterk nieuw wachtwoord"
                        />
                    ) : (
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                        />
                    )}

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    {isAdmin ? (
                        <label className={labelStyle}>Bevestig Nieuw Wachtwoord</label>
                    ) : (
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    )}

                    {isAdmin ? (
                        <input
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type="password"
                            className={inputStyle}
                            autoComplete="new-password"
                            placeholder="Herhaal je nieuwe wachtwoord"
                        />
                    ) : (
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type="password"
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                        />
                    )}

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

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
                                    Wijzigen...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>🔐</span>
                                    Wachtwoord wijzigen
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
                            {isAdmin ? '✅ Wachtwoord gewijzigd!' : 'Saved.'}
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
